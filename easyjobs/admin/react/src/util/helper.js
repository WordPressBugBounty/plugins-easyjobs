import { toast } from 'react-toastify';

export const getImageUrl = (path) =>
  `${easyJobsJs.plugin_url}admin/assets/img/${path}`;

export const manipulateWpMenu = () => {
  window.addEventListener('load', () => {
    const menu = document.querySelector(
      '#adminmenu .toplevel_page_easyjobs-admin',
    );
    if (easyJobsJs.current_page.includes('easyjobs-edit')) {
      menu.classList.remove('wp-not-current-submenu');
      menu.classList.add('wp-has-current-submenu', 'current');
    }
  });
};

export function ucFirst(string) {
  return (string && string.charAt(0).toUpperCase() + string.slice(1)) || string;
}

export const validateFormFields = (formFields, rules) => {
  const errors = {};
  for (const field in formFields) {
    if (formFields.hasOwnProperty(field)) {
      if (rules.hasOwnProperty(field)) {
        const fieldRules = rules[field];
        let value = '';
        if (typeof formFields[field] !== 'object') {
          value = formFields[field];
        } else {
          value = formFields[field];
        }
        if (fieldRules.hasOwnProperty('required')) {
          let valid = true;
          if (typeof value === 'undefined') {
            valid = false;
          } else {
            if (typeof value === 'boolean') {
              if (!value) {
                valid = false;
              }
            } else if (typeof value === 'object') {
              if (!Object.keys(value).length) {
                valid = false;
              }
            } else if (!value.toString().length) {
              valid = false;
            }
          }
          if (field === 'website' && value?.length > 0) {
            if (!isValidDomain(value)) {
              errors[field] = 'Invalid domain name';
            }
            continue;
          }
          if (!valid) {
            if (typeof fieldRules.required !== 'object') {
              errors[field] = `The ${field} field is required`;
            } else {
              errors[field] = fieldRules.required.message;
            }
            continue;
          }
        }
        /* eslint-disable */
        if (fieldRules.hasOwnProperty('email') && formFields[field].length) {
          const pattern = new RegExp(
            /(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
          );
          if (!pattern.test(formFields[field])) {
            if (typeof fieldRules.email !== 'object') {
              errors[field] = `${ucFirst(field)} must be a valid email`;
            } else {
              errors[field] = fieldRules.email.message;
            }
          }
        }
        if (fieldRules.hasOwnProperty('username')) {
          const pattern = new RegExp(/^\S+$/);
          if (!pattern.test(formFields[field])) {
            if (typeof fieldRules.username !== 'object') {
              errors[field] = `${ucFirst(field)} must be a valid username`;
            } else {
              errors[field] = fieldRules.username.message;
            }
          }
        }
        /* eslint-enable */

        if (fieldRules.hasOwnProperty('minLength')) {
          if (formFields[field].length > fieldRules.minLength.value) {
            if (typeof fieldRules.minLength !== 'object') {
              errors[field] = `The length of ${ucFirst(field)} must be under ${
                fieldRules.minLength.value
              } character`;
            } else {
              errors[field] = fieldRules.minLength.message;
            }
          }
        }
        if (fieldRules.hasOwnProperty('maxLength')) {
          if (formFields[field].length > fieldRules.maxLength.value) {
            if (typeof fieldRules.maxLength !== 'object') {
              errors[field] = `The length of ${ucFirst(field)} must be under ${
                fieldRules.maxLength.value
              } character`;
            } else {
              errors[field] = fieldRules.maxLength.message;
            }
          }
        }
        if (fieldRules.hasOwnProperty('match')) {
          const matchField =
            typeof fieldRules.match !== 'object'
              ? fieldRules.match
              : fieldRules.match.value;
          const matchFieldValue = formFields[matchField];
          if (matchFieldValue && matchFieldValue !== formFields[field]) {
            if (typeof fieldRules.match !== 'object') {
              errors[field] = `The ${ucFirst(field)} must match with ${ucFirst(
                matchField,
              )}`;
            } else {
              errors[field] = fieldRules.match.message;
            }
          }
        }
      }
    }
  }
  if (Object.keys(errors).length) {
    return {
      valid: false,
      errors,
    };
  }
  return {
    valid: true,
    errors: undefined,
  };
};

const isValidDomain = (domain) => {
  const domainRegex = /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\/?$/;
  return domainRegex.test(domain);
};

export const hasFormError = (field, errors) =>
  errors && field && errors.hasOwnProperty(field);

export const getPageLink = (pageLink) => 'admin.php?page=' + pageLink;

export const getJobTypeObjectKey = (jobType) => {
  switch (jobType) {
    case 'archived':
      return 'archivedJobs';
    case 'draft':
      return 'draftJobs';
    case 'all':
      return 'allJobs';
    case 'internal':
      return 'internalJobs';
    default:
      return 'publishedJobs';
  }
};

export const getPipelineLabel = (name) => {
  switch (name.toLowerCase()) {
    case 'selected':
      return 'success-label';
    case 'rejected':
      return 'danger-label';
    default:
      return 'primary-label';
  }
};

/**
 * Stage label for a candidate row. The job-candidates API can return
 * `pipeline: null` while `job_pipeline_id` is set, so fall back to the job's
 * own pipeline list (the same data the kanban board groups by).
 *
 * @param {object} candidate Candidate from the job-candidates API.
 * @param {Array}  pipelines The job's pipeline steps ({ id, label }).
 * @return {string} Stage label, or '' when it can't be resolved.
 */
export const getCandidateStageLabel = (candidate, pipelines) => {
  if (candidate?.pipeline?.label) {
    return candidate.pipeline.label;
  }
  const id = candidate?.job_pipeline_id;
  if (id === undefined || id === null || !Array.isArray(pipelines)) {
    return '';
  }
  const step = pipelines.find((p) => String(p?.id) === String(id));
  return step?.label || '';
};

export const ratingIcon = (rating) => {
  let stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <div
        className={i <= rating ? 'rate-count rated has-rating' : 'rate-count'}
      >
        <i className="easyjobs-icon easyjobs-star"></i>
      </div>,
    );
  }
  return stars;
};

export const candidateSortOptions = () => {
  return [
    {
      title: 'Sort by experience',
      value: 'SORT_BY_EXPERIENCE',
    },
    {
      title: 'Sort by skill match',
      value: 'SORT_BY_SKILL_MATCH',
    },
    {
      title: 'Sort by education match',
      value: 'SORT_BY_EDUCATION_MATCH',
    },
    {
      title: 'Sort by experience match',
      value: 'SORT_BY_EXPERIENCE_MATCH',
    },
    {
      title: 'Sort by AI score',
      value: 'SORT_BY_TOTAL_AI_SCORE',
    },
    {
      title: 'Sort by quiz score',
      value: 'SORT_BY_QUIZ_SCORE',
    },
  ];
};

export function getAiScoreColor(name) {
  const colors = {
    quiz: '#ff9635',
    skill: '#2fc1e1',
    education: '#597dfc',
    experience: '#60ce83',
    final_score: '#ff5f74',
  };

  return colors[name];
}

export const getAiScoreDetails = (scores) => {
  let scoreDetails = [];
  for (const key in scores) {
    if (scores[key] !== null) {
      scoreDetails.push(
        <li>
          {ucFirst(key.replace('_', ' '))}:{' '}
          <strong style={{ color: getAiScoreColor(key) }}>
            {scores[key]}%
          </strong>
        </li>,
      );
    }
  }
  return scoreDetails;
};

export const allFilters = () => {
  return [
    {
      name: 'New',
      value: 1,
    },
    {
      name: 'Rated',
      value: 2,
    },
    {
      name: 'Not rated',
      value: 3,
    },
  ];
};

export const stages = () => {
  return [
    {
      stage: 'Applied',
      value: 0,
    },
    {
      stage: 'Shortlist',
      value: 1,
    },
    {
      stage: 'Interview',
      value: 2,
    },
    {
      stage: 'Selected',
      value: 'selected',
    },
    {
      stage: 'Rejected',
      value: 'rejected',
    },
  ];
};

export function getMarkPercentage(total, mark) {
  if (!total) {
    return 0;
  }
  return Math.round((mark / total) * 100);
}

export function getMessage(action, defaultMessage = 'Operation failed') {
  return action?.message?.length ? action.message : defaultMessage;
}

export function getFormatedDate(date, locale, year, month, day) {
  return new Date(date).toLocaleDateString(locale, {
    year: year,
    month: month,
    day: day,
  });
}

export const findDuplicate = (arr) => {
  const duplicates = arr.reduce((acc, obj, i) => {
    if (obj.title.trim() !== '') {
      const foundIndex = arr.findIndex(
        (o, j) =>
          i !== j &&
          o.title.trim().toLowerCase() === obj.title.trim().toLowerCase(),
      );
      if (
        foundIndex !== -1 &&
        foundIndex < i &&
        !acc.some(
          (o) =>
            o.title.trim().toLowerCase() === obj.title.trim().toLowerCase(),
        )
      ) {
        acc.push(obj);
      }
      return acc;
    }
  }, []);
  if (duplicates?.length) {
    return true;
  }
  return false;
};

const PIPELINE_TYPE = {
  APPLIED: 1,
  REGULAR: 10,
  REMOTE_INTERVIEW: 50,
  SELECTED: 99,
  REJECTED: 100,
};

export const customPipelineTypeList = [
  {
    label: 'Applied',
    value: PIPELINE_TYPE.APPLIED,
  },
  {
    label: 'Regular',
    value: PIPELINE_TYPE.REGULAR,
  },
  {
    label: 'Remote Interview',
    value: PIPELINE_TYPE.REMOTE_INTERVIEW,
  },
  {
    label: 'Selected',
    value: PIPELINE_TYPE.SELECTED,
  },
  {
    label: 'Rejected',
    value: PIPELINE_TYPE.REJECTED,
  },
];

export const stepTypeLabel = (type) => {
  const step = customPipelineTypeList.find((step) => {
    return step.value == type;
  });
  return step?.label;
};

export const ejLabelBGColor = (stage) => {
  if (stage == 1) {
    return 'primary-label';
  } else if (stage == 99) {
    return 'success-label';
  } else if (stage == 100) {
    return 'danger-label';
  } else {
    return 'info-label';
  }
};

export const loginOptionsData = [
  {
    id: 'google',
    title: 'Google',
    e_icon: 'google',
    hint: 'This allows social login by Google account.',
    selected: false,
  },
  {
    id: 'linkedin',
    title: 'LinkedIn',
    e_icon: 'linkedin',
    hint: 'This allows social login by Linkedin account.',
    selected: false,
  },
  {
    id: 'email',
    title: 'Email',
    e_icon: 'envelope-outline',
    hint: 'This allows login by easy.jobs account.',
    selected: false,
  },
];

export const ejFieldTypes = {
  allowedFileTypes: [],
  allowedFileTypeExtensionsWise: {
    images: {},
    documents: {},
    others: {},
  },
  isSelected: {
    documents: false,
    images: false,
    others: false,
  },
  allDocumentsFieldSelected: false,
  allImagesFieldSelected: false,
  allOthersFieldSelected: false,
  extensions: {
    documents: ['pdf', 'doc', 'xls', 'ppt'],
    images: ['jpg', 'jpeg', 'png', 'svg', 'gif'],
    others: ['mp3', 'mp4', 'zip'],
  },
};

export const eventImages = [
  'invitation.png',
  'share_jobs.png',
  'read_blogs.png',
];

export const copyToClipboard = (text) => {
  navigator?.clipboard
    ?.writeText(text)
    ?.then(() => {
      toast.success('Copied', { autoClose: 1000 });
    })
    .catch((err) => {
      console.error('Failed to copy: ', err);
    });
};

// ─── Dashboard redesign helpers ───────────────────────────────────────────────

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#FFB48A,#E26A4D)',
  'linear-gradient(135deg,#5EEAD4,#0F766E)',
  'linear-gradient(135deg,#F472B6,#DB2777)',
  'linear-gradient(135deg,#60A5FA,#2563EB)',
  'linear-gradient(135deg,#A78BFA,#6D4DE3)',
  'linear-gradient(135deg,#FCD34D,#D97706)',
];

export function getAvatarGradient(name) {
  if (!name) return AVATAR_GRADIENTS[0];
  const sum = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_GRADIENTS[sum % AVATAR_GRADIENTS.length];
}

export function getInitials(name) {
  if (!name) return '';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(function (w) {
      return w[0].toUpperCase();
    })
    .join('');
}

// Maps a pipeline/status label to a candidate status-pill colour class
// (.c-pill.{class}) used by the new candidate list grid & list views.
export function getStatusPillClass(label) {
  var l = (label || '').toLowerCase();
  if (l.indexOf('reject') !== -1) return 'red';
  if (l.indexOf('shortlist') !== -1) return 'amber';
  if (l.indexOf('interview') !== -1) return 'amber';
  if (l.indexOf('test') !== -1) return 'sky';
  if (l.indexOf('offer') !== -1) return 'violet';
  if (l.indexOf('hire') !== -1 || l.indexOf('select') !== -1) return 'green';
  return 'accent';
}

export function timeAgo(dateStr) {
  if (!dateStr) return '';
  var diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'h ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}
