import axios from 'axios';

export function ajaxCall(ajaxAction, data) {
  const url = easyJobsJs.ajax_url;

  let formData = new FormData();
  formData.append('action', ajaxAction);
  formData.append('nonce', easyJobsJs.nonce);
  if (data) {
    for (const key of Object.keys(data)) {
      if (typeof data[key] !== 'undefined') {
        if (typeof data[key] === 'object') {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      }
    }
  }

  return axios
    .post(url, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      if (response?.data?.reload_required === 'reload') {
        window.location.reload();
      }
      return response.data;
    })
    .catch((error) => ({
      status: 'error',
      message: error,
    }));
}

export function fileUpload(ajaxAction, fileData, data) {
  const url = easyJobsJs.ajax_url;

  let formData = new FormData();
  formData.append('action', ajaxAction);
  formData.append('nonce', easyJobsJs.nonce);
  formData.append(fileData.key, fileData.file, fileData.name);
  if (data) {
    for (const key of Object.keys(data)) {
      if (typeof data[key] !== 'undefined') {
        if (typeof data[key] === 'object') {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      }
    }
  }

  return axios
    .post(url, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.data)
    .catch((error) => ({
      status: 'error',
      message: error,
    }));
}
