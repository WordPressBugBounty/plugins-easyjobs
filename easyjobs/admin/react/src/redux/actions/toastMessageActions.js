export const SHOW_MESSAGE = 'SHOW_MESSAGE';
export const RESET_MESSAGE = 'RESET_MESSAGE';

export function showMessage({ status, message }) {
  return {
    type: SHOW_MESSAGE,
    status,
    message,
  };
}

export function resetMessage() {
  return {
    type: RESET_MESSAGE,
  };
}
