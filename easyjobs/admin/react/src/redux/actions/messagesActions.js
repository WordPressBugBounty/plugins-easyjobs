// Conversation list
export const GET_CONVERSATIONS = 'GET_CONVERSATIONS';
export const GET_CONVERSATIONS_SUCCESS = 'GET_CONVERSATIONS_SUCCESS';
export const GET_CONVERSATIONS_FAILED = 'GET_CONVERSATIONS_FAILED';

// Single conversation thread
export const GET_CONVERSATION_THREAD = 'GET_CONVERSATION_THREAD';
export const GET_CONVERSATION_THREAD_SUCCESS =
  'GET_CONVERSATION_THREAD_SUCCESS';
export const GET_CONVERSATION_THREAD_FAILED = 'GET_CONVERSATION_THREAD_FAILED';

// Send a message
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS';
export const SEND_MESSAGE_FAILED = 'SEND_MESSAGE_FAILED';

// Read / unread status
export const CHANGE_MESSAGE_STATUS = 'CHANGE_MESSAGE_STATUS';
export const CHANGE_MESSAGE_STATUS_SUCCESS = 'CHANGE_MESSAGE_STATUS_SUCCESS';
export const CHANGE_MESSAGE_STATUS_FAILED = 'CHANGE_MESSAGE_STATUS_FAILED';

// New-conversation applicant picker (applicants without a conversation)
export const GET_NEW_APPLICANTS = 'GET_NEW_APPLICANTS';
export const GET_NEW_APPLICANTS_SUCCESS = 'GET_NEW_APPLICANTS_SUCCESS';
export const GET_NEW_APPLICANTS_FAILED = 'GET_NEW_APPLICANTS_FAILED';

// Unseen message notifications
export const GET_MESSAGE_NOTIFICATIONS = 'GET_MESSAGE_NOTIFICATIONS';
export const GET_MESSAGE_NOTIFICATIONS_SUCCESS =
  'GET_MESSAGE_NOTIFICATIONS_SUCCESS';
export const GET_MESSAGE_NOTIFICATIONS_FAILED =
  'GET_MESSAGE_NOTIFICATIONS_FAILED';

export function getConversations(params, append = false) {
  return {
    type: GET_CONVERSATIONS,
    params,
    append,
  };
}

export function getConversationThread(params, append = false) {
  return {
    type: GET_CONVERSATION_THREAD,
    params,
    append,
  };
}

export function sendMessage(params) {
  return {
    type: SEND_MESSAGE,
    params,
  };
}

export function changeMessageStatus(params) {
  return {
    type: CHANGE_MESSAGE_STATUS,
    params,
  };
}

export function getNewApplicants(params, append = false) {
  return {
    type: GET_NEW_APPLICANTS,
    params,
    append,
  };
}

export function getMessageNotifications() {
  return {
    type: GET_MESSAGE_NOTIFICATIONS,
  };
}
