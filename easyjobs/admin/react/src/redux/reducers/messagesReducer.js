import {
  GET_CONVERSATIONS,
  GET_CONVERSATIONS_SUCCESS,
  GET_CONVERSATIONS_FAILED,
  GET_CONVERSATION_THREAD,
  GET_CONVERSATION_THREAD_SUCCESS,
  GET_CONVERSATION_THREAD_FAILED,
  SEND_MESSAGE,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAILED,
  CHANGE_MESSAGE_STATUS_SUCCESS,
  CHANGE_MESSAGE_STATUS_FAILED,
  GET_NEW_APPLICANTS,
  GET_NEW_APPLICANTS_SUCCESS,
  GET_NEW_APPLICANTS_FAILED,
  GET_MESSAGE_NOTIFICATIONS_SUCCESS,
} from '../actions/messagesActions';

/** Unwrap a Laravel paginator (or accept a plain array). */
const rowsOf = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
};
import { toast } from 'react-toastify';
import { __ } from '@wordpress/i18n';
import { getMessage } from '../../util/helper';

const initialState = {
  conversations: undefined,
  conversationsLoading: undefined,
  conversationsPage: 1,
  conversationsLastPage: 1,
  // Filters last used to fetch the list, so we can silently refresh after a send.
  listParams: undefined,
  thread: undefined,
  threadLoading: undefined,
  // Thread message pagination (reverse infinite scroll — older pages prepended).
  threadPage: 1,
  threadLastPage: 1,
  threadLoadingMore: undefined,
  sending: undefined,
  unseen: 0,
  // New-conversation applicant picker.
  newApplicants: undefined,
  newApplicantsLoading: undefined,
  newApplicantsPage: 1,
  newApplicantsLastPage: 1,
  // True when the last applicant fetch failed (e.g. timed out), so the picker
  // can show an error + retry instead of the "nothing found" empty state.
  newApplicantsError: false,
};

export default function messages(state = initialState, action) {
  switch (action.type) {
    case GET_CONVERSATIONS:
      return {
        ...state,
        conversationsLoading: true,
        conversationsError: undefined,
        // Keep the current rows during loading (search/filter/append) so only the
        // very first load shows the full skeleton; SUCCESS replaces or appends.
        // Track filters for the post-send refresh — page-1 base only.
        listParams: action.append ? state.listParams : action.params,
      };
    case GET_CONVERSATIONS_SUCCESS: {
      const rows = rowsOf(action.data);
      return {
        ...state,
        conversations:
          action.append && state.conversations
            ? [...state.conversations, ...rows]
            : rows,
        conversationsLoading: false,
        conversationsError: undefined,
        conversationsPage: (action.data && action.data.current_page) || 1,
        conversationsLastPage: (action.data && action.data.last_page) || 1,
      };
    }
    case GET_CONVERSATIONS_FAILED:
      return {
        ...state,
        conversations: state.conversations || [],
        conversationsLoading: false,
        conversationsError: action.error || 'Unable to load conversations',
      };

    case GET_CONVERSATION_THREAD:
      // Loading an older page → keep the open thread; only flag the top spinner.
      if (action.append) {
        return { ...state, threadLoadingMore: true };
      }
      return {
        ...state,
        thread: undefined,
        threadLoading: true,
        threadPage: 1,
        threadLastPage: 1,
      };
    case GET_CONVERSATION_THREAD_SUCCESS: {
      // Both the thread and send-message endpoints nest the applicant under
      // `data.applicant`; store that object so the component maps it uniformly.
      const applicant =
        action.data && action.data.applicant
          ? action.data.applicant
          : action.data;
      const meta = (applicant && applicant.messages) || {};
      const pageRows =
        applicant &&
        applicant.messages &&
        Array.isArray(applicant.messages.data)
          ? applicant.messages.data
          : [];

      // Older page → prepend its rows before the already-loaded (newer) ones,
      // keeping the merged list ascending by time.
      if (action.append && state.thread && state.thread.messages) {
        return {
          ...state,
          thread: {
            ...state.thread,
            messages: {
              ...state.thread.messages,
              data: [...pageRows, ...state.thread.messages.data],
              current_page: meta.current_page,
              last_page: meta.last_page,
            },
          },
          threadPage: meta.current_page || state.threadPage,
          threadLastPage: meta.last_page || state.threadLastPage,
          threadLoadingMore: false,
        };
      }

      return {
        ...state,
        thread: applicant,
        threadLoading: false,
        threadPage: meta.current_page || 1,
        threadLastPage: meta.last_page || 1,
        threadLoadingMore: false,
      };
    }
    case GET_CONVERSATION_THREAD_FAILED:
      if (action.append) {
        return { ...state, threadLoadingMore: false };
      }
      return {
        ...state,
        thread: 'unable',
        threadLoading: false,
      };

    case SEND_MESSAGE:
      return {
        ...state,
        sending: true,
      };
    case SEND_MESSAGE_SUCCESS: {
      // Backend returns the refreshed applicant payload (page 1) under data.applicant.
      const applicant =
        action.data && action.data.applicant ? action.data.applicant : null;
      if (!applicant) {
        return { ...state, sending: false };
      }
      const meta = applicant.messages || {};
      return {
        ...state,
        thread: applicant,
        sending: false,
        // Sending reloads page 1, so reset pagination (older history re-fetches on scroll).
        threadPage: meta.current_page || 1,
        threadLastPage: meta.last_page || 1,
      };
    }
    case SEND_MESSAGE_FAILED:
      toast.error(getMessage(action, 'Unable to send message'), {
        autoClose: 1500,
      });
      return {
        ...state,
        sending: false,
      };

    case CHANGE_MESSAGE_STATUS_SUCCESS: {
      // The API's success payload omits its message, so build it from the status.
      toast.success(
        action.status === 'unread'
          ? __('Marked as unread.', 'easyjobs')
          : __('Marked as read.', 'easyjobs'),
        { autoClose: 1500 },
      );
      if (!state.thread || typeof state.thread !== 'object') {
        return state;
      }
      // `read` = "the Mark-As-Read action is available" (i.e. currently unread).
      // After marking 'read', that action is no longer available → read: false;
      // after 'unread', it becomes available again → read: true.
      return {
        ...state,
        thread: { ...state.thread, read: action.status === 'unread' },
      };
    }
    case CHANGE_MESSAGE_STATUS_FAILED:
      toast.error(getMessage(action, 'Unable to update message status'), {
        autoClose: 1500,
      });
      return state;

    case GET_NEW_APPLICANTS:
      return {
        ...state,
        newApplicantsLoading: true,
        newApplicantsError: false,
        // Keep the list while paginating (append); clear it for a fresh query.
        newApplicants: action.append ? state.newApplicants : undefined,
      };
    case GET_NEW_APPLICANTS_SUCCESS: {
      const rows = rowsOf(action.data);
      return {
        ...state,
        newApplicants:
          action.append && state.newApplicants
            ? [...state.newApplicants, ...rows]
            : rows,
        newApplicantsLoading: false,
        newApplicantsError: false,
        newApplicantsPage: (action.data && action.data.current_page) || 1,
        newApplicantsLastPage: (action.data && action.data.last_page) || 1,
      };
    }
    case GET_NEW_APPLICANTS_FAILED:
      return {
        ...state,
        newApplicants: state.newApplicants || [],
        newApplicantsLoading: false,
        newApplicantsError: true,
      };

    case GET_MESSAGE_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        unseen:
          action.data && typeof action.data.unseenMessage !== 'undefined'
            ? action.data.unseenMessage
            : state.unseen,
      };

    default:
      return state;
  }
}
