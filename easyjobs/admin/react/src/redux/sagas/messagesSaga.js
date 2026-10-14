import { all, put, select, takeLatest } from 'redux-saga/effects';
import { ajaxCall } from '../../util/ajaxCall';
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
  CHANGE_MESSAGE_STATUS,
  CHANGE_MESSAGE_STATUS_SUCCESS,
  CHANGE_MESSAGE_STATUS_FAILED,
  GET_NEW_APPLICANTS,
  GET_NEW_APPLICANTS_SUCCESS,
  GET_NEW_APPLICANTS_FAILED,
  GET_MESSAGE_NOTIFICATIONS,
  GET_MESSAGE_NOTIFICATIONS_SUCCESS,
  GET_MESSAGE_NOTIFICATIONS_FAILED,
} from '../actions/messagesActions';

// Conversation list
export function* fetchConversations({ params, append }) {
  const response = yield ajaxCall('easyjobs_get_conversations', { ...params });
  if (response.status === 'success') {
    yield put({ type: GET_CONVERSATIONS_SUCCESS, data: response.data, append });
  } else {
    // Surface the raw API response so the failure is debuggable in DevTools.
    // eslint-disable-next-line no-console
    console.error('[easyjobs] get_conversations failed:', response);
    yield put({
      type: GET_CONVERSATIONS_FAILED,
      error: response.message || response,
    });
  }
}
export function* watchConversations() {
  yield takeLatest(GET_CONVERSATIONS, fetchConversations);
}

// Single thread. `append` = loading an older page via infinite scroll (prepend).
// Reading is explicit (the toolbar "Mark As Read" button) — opening a conversation
// does NOT auto-mark it read, so the unread state/badge stay accurate until the user acts.
export function* fetchThread({ params, append }) {
  const response = yield ajaxCall('easyjobs_get_conversation_thread', {
    ...params,
  });
  if (response.status === 'success') {
    yield put({
      type: GET_CONVERSATION_THREAD_SUCCESS,
      data: response.data,
      append,
    });
  } else {
    yield put({
      type: GET_CONVERSATION_THREAD_FAILED,
      error: response.message,
      append,
    });
  }
}
export function* watchThread() {
  yield takeLatest(GET_CONVERSATION_THREAD, fetchThread);
}

// Send. On success, refresh the list (preview/order) using the last filters.
export function* postMessage({ params }) {
  // Drop an empty file so ajaxCall doesn't serialize null as the string "null".
  const payload = { ...params };
  if (!payload.file) {
    delete payload.file;
  }
  const response = yield ajaxCall('easyjobs_send_message', payload);
  if (response.status === 'success') {
    yield put({ type: SEND_MESSAGE_SUCCESS, data: response.data });
    const listParams = yield select((state) => state.messages.listParams);
    yield put({ type: GET_CONVERSATIONS, params: listParams || {} });
  } else {
    yield put({ type: SEND_MESSAGE_FAILED, error: response.message });
  }
}
export function* watchSendMessage() {
  yield takeLatest(SEND_MESSAGE, postMessage);
}

// Read / unread toggle (the thread toolbar button). On success, flip the thread's
// read flag (in the reducer) and refresh the unread badge + the list's unread styling.
export function* postMessageStatus({ params }) {
  const response = yield ajaxCall('easyjobs_change_message_status', {
    ...params,
  });
  if (response.status === 'success') {
    yield put({
      type: CHANGE_MESSAGE_STATUS_SUCCESS,
      data: response.data,
      status: params.status,
    });
    yield put({ type: GET_MESSAGE_NOTIFICATIONS });
    const listParams = yield select((state) => state.messages.listParams);
    yield put({ type: GET_CONVERSATIONS, params: listParams || {} });
  } else {
    yield put({ type: CHANGE_MESSAGE_STATUS_FAILED, error: response.message });
  }
}
export function* watchMessageStatus() {
  yield takeLatest(CHANGE_MESSAGE_STATUS, postMessageStatus);
}

// New-conversation applicant picker (applicants without a conversation)
export function* fetchNewApplicants({ params, append }) {
  const response = yield ajaxCall('easyjobs_get_conversations', { ...params });
  if (response.status === 'success') {
    yield put({
      type: GET_NEW_APPLICANTS_SUCCESS,
      data: response.data,
      append,
    });
  } else {
    yield put({ type: GET_NEW_APPLICANTS_FAILED, error: response.message });
  }
}
export function* watchNewApplicants() {
  yield takeLatest(GET_NEW_APPLICANTS, fetchNewApplicants);
}

// Unseen notifications counter
export function* fetchNotifications() {
  const response = yield ajaxCall('easyjobs_get_message_notifications');
  if (response.status === 'success') {
    yield put({ type: GET_MESSAGE_NOTIFICATIONS_SUCCESS, data: response.data });
  } else {
    yield put({
      type: GET_MESSAGE_NOTIFICATIONS_FAILED,
      error: response.message,
    });
  }
}
export function* watchNotifications() {
  yield takeLatest(GET_MESSAGE_NOTIFICATIONS, fetchNotifications);
}

export default function* rootSaga() {
  yield all([
    watchConversations(),
    watchThread(),
    watchSendMessage(),
    watchMessageStatus(),
    watchNewApplicants(),
    watchNotifications(),
  ]);
}
