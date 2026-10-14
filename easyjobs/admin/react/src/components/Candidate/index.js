import { __ } from '@wordpress/i18n';
import Pager from '../../util/Pager';
import Icon from '../../util/Icon';
import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import {
  getAllCandidates,
  getCompanyJobs,
  resetCandidatesId,
} from '../../redux/actions/candidateActions';
import { getCandidateLimit } from '../../redux/actions/dashboardActions';
import PlanUsage from './PlanUsage';
import CandidateLimitNotice from '../Common/CandidateLimitNotice';
import CandidateCard from './CandidateCard';
import CandidateRow from './CandidateRow';
import CandidateSkeleton from './CandidateSkeleton';

const mapStateToProps = (state) => {
  return {
    companyJobs: state.candidate.companyJobs,
    allCandidates: state.candidate.allCandidates,
    loading: state.candidate.loading,
    candidateLimit: state.dashboard.candidateLimit,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCompanyJobs: () => dispatch(getCompanyJobs()),
    resetCandidatesId: () => dispatch(resetCandidatesId()),
    getAllCandidates: (params) => dispatch(getAllCandidates(params)),
    getCandidateLimit: () => dispatch(getCandidateLimit()),
  };
};
const defaultJobNameSearchText = '';
const defaultSelectedJob = undefined;
const defaultSelectedPipelineStatus = '';
const defaultSelectedRating = [
  { value: 5, selected: true },
  { value: 4, selected: true },
  { value: 3, selected: true },
  { value: 2, selected: true },
  { value: 1, selected: true },
  { value: 0, selected: true },
];
const defaultSelectedHideStatus = [
  { value: 5, label: 'Selected', selected: false },
  { value: 9, label: 'Rejected', selected: false },
];

const sortOptions = [
  { v: 'newest', label: __('Newest applied', 'easyjobs') },
  { v: 'oldest', label: __('Oldest applied', 'easyjobs') },
  { v: 'az', label: __('Name A–Z', 'easyjobs') },
  { v: 'za', label: __('Name Z–A', 'easyjobs') },
  { v: 'rated', label: __('Highest rated', 'easyjobs') },
];

const Candidates = ({
  getAllCandidates,
  allCandidates,
  getCompanyJobs,
  companyJobs,
  loading,
  resetCandidatesId,
  candidateLimit,
  getCandidateLimit,
}) => {
  const getUrlSearchParam = (paramName) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(paramName) || '';
  };

  const getCurrentFilterParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const filterParams = new URLSearchParams();

    const filterKeys = [
      'candidate',
      'job',
      'pipelineType',
      'pipeline',
      'status',
      'rating',
      'pageNum',
      'per_page',
    ];

    filterKeys.forEach((key) => {
      if (key === 'rating' || key === 'status') {
        const paramValue = urlParams.get(key);
        if (paramValue) {
          const values = paramValue
            .split(',')
            .filter((val) => val.trim() !== '');
          const validValues = values.filter(
            (value) =>
              value !== null &&
              value !== undefined &&
              (value === 0 || value === '0' || value.toString().trim() !== ''),
          );
          if (validValues.length > 0) {
            filterParams.set(key, validValues.join(','));
          }
        }
      } else {
        const paramValue = urlParams.get(key);
        if (
          paramValue !== null &&
          paramValue !== undefined &&
          (paramValue === 0 ||
            paramValue === '0' ||
            paramValue.toString().trim() !== '')
        ) {
          filterParams.set(key, paramValue);
        }
      }
    });

    const filterString = filterParams.toString();
    return filterString ? `&${filterString}` : '';
  };

  // localStorage utility functions for filter persistence
  const FILTER_STORAGE_KEY = 'easyjobs_candidate_filters';

  const saveFiltersToLocalStorage = () => {
    try {
      const currentFilters = getCurrentFilterParams();
      if (currentFilters) {
        localStorage.setItem(FILTER_STORAGE_KEY, currentFilters);
      } else {
        localStorage.removeItem(FILTER_STORAGE_KEY);
      }
    } catch (error) {
      console.warn('localStorage unavailable for filter persistence:', error);
    }
  };

  // Set navigation context for candidate details navigation
  const handleCandidateNavigation = () => {
    try {
      const currentFilters = getCurrentFilterParams();
      if (currentFilters && currentFilters.trim() !== '') {
        sessionStorage.setItem('easyjobs_navigation_context', 'filtered_list');
      } else {
        sessionStorage.setItem(
          'easyjobs_navigation_context',
          'unfiltered_list',
        );
      }
    } catch (error) {
      console.warn('SessionStorage unavailable for navigation context:', error);
    }
  };

  const getUrlSearchParams = (paramName) => {
    const urlParams = new URLSearchParams(window.location.search);
    const paramValue = urlParams.get(paramName);

    if (paramValue) {
      return paramValue.split(',').filter((val) => val.trim() !== '');
    }
    return [];
  };

  const updateUrlSearchParam = (paramName, value) => {
    const url = new URL(window.location);
    // Coerce to string: the new dropdowns can pass numeric ids (the old UI's
    // radio inputs always handed these in as strings via e.target.value).
    const v = value === null || value === undefined ? '' : String(value);
    if (v.trim() !== '') {
      url.searchParams.set(paramName, v);
    } else {
      url.searchParams.delete(paramName);
    }
    window.history.pushState({}, '', url);
  };

  const updateUrlSearchParams = (paramName, values) => {
    if (isPageReload.current) {
      return;
    }

    const url = new URL(window.location);
    url.searchParams.delete(paramName);

    if (values && values.length > 0) {
      const validValues = values.filter(
        (value) =>
          value === 0 ||
          value === '0' ||
          (value && value.toString().trim() !== ''),
      );

      if (validValues.length > 0) {
        const commaSeparatedValues = validValues.join(',');
        url.searchParams.set(paramName, commaSeparatedValues);
      }
    }

    window.history.pushState({}, '', url);
  };

  const [searchText, setSearchText] = useState(() =>
    getUrlSearchParam('candidate'),
  );
  const [jobs, setJobs] = useState([]);
  const [jobNameSearchText, setJobNameSearchText] = useState(
    defaultJobNameSearchText,
  );
  const [selectedJob, setSelectedJob] = useState(() => {
    const urlJobParam = getUrlSearchParam('job');
    return urlJobParam ? urlJobParam : defaultSelectedJob;
  });
  const [selectedStatus, setSelectedStatus] = useState(() => {
    const urlPipelineParam = getUrlSearchParam('pipeline');
    return urlPipelineParam ? urlPipelineParam : defaultSelectedPipelineStatus;
  });
  const [selectedGlobalPipeline, setSelectedGlobalPipeline] = useState(() => {
    const urlPipelineTypeParam = getUrlSearchParam('pipelineType');
    return urlPipelineTypeParam
      ? urlPipelineTypeParam
      : defaultSelectedPipelineStatus;
  });
  const [page, setPage] = useState(() => {
    const urlPageParam = getUrlSearchParam('pageNum');
    const pageNum = parseInt(urlPageParam);
    return urlPageParam && pageNum > 1 ? pageNum : 1;
  });
  const [timeoutId, setTimeoutId] = useState(true);
  const [allStatus, setAllStatus] = useState(undefined);
  const [ratingValues, setRatingValues] = useState(() => {
    const urlRatingParams = getUrlSearchParams('rating');
    if (urlRatingParams.length > 0) {
      const initialState = defaultSelectedRating.map((item) => ({
        ...item,
        selected: urlRatingParams.includes(item.value.toString()),
      }));
      return initialState;
    }
    return defaultSelectedRating;
  });
  const [hideStatus, setHideStatus] = useState(() => {
    const urlStatusParams = getUrlSearchParams('status');
    if (urlStatusParams.length > 0) {
      return defaultSelectedHideStatus.map((item) => ({
        ...item,
        selected: urlStatusParams.includes(item.value.toString()),
      }));
    }
    return defaultSelectedHideStatus;
  });
  const globalPipeline = [
    { type: 1, label: 'Applied' },
    { type: 50, label: 'Interview' },
    { type: 99, label: 'Selected' },
    { type: 100, label: 'Rejected' },
  ];
  const [filterbarContentJob, setFilterbarContentJob] = useState('');
  const [filterbarContentPipeline, setFilterbarContentPipeline] =
    useState('All');
  const [isInitialized, setIsInitialized] = useState(false);
  const isPageReload = useRef(true);

  // New UI state
  const [currentView, setCurrentView] = useState(() => {
    try {
      return localStorage.getItem('easyjobs_candidate_view') || 'grid';
    } catch (e) {
      return 'grid';
    }
  });
  const [sortBy, setSortBy] = useState('newest');
  const [openPop, setOpenPop] = useState(null); // 'status' | 'job' | 'filter' | 'sort' | 'psize'
  const [pageSize, setPageSize] = useState(() => {
    const p = parseInt(getUrlSearchParam('per_page'));
    return p && [20, 50, 100].includes(p) ? p : 20;
  });
  const searchRef = useRef(null);

  useEffect(() => {
    document.title = `Easyjobs - Candidates ‹ ${easyJobsJs.title} — Wordpress`;

    const initialSearchText = getUrlSearchParam('candidate');
    const initialJobId = getUrlSearchParam('job');
    const initialPipelineType = getUrlSearchParam('pipelineType');
    const initialPipeline = getUrlSearchParam('pipeline');
    const initialStatusParams = getUrlSearchParams('status');
    const initialRatingParams = getUrlSearchParams('rating');

    const initialParams = { page, per_page: pageSize };
    if (initialSearchText) {
      initialParams.candidate_name = initialSearchText;
    }
    if (initialJobId) {
      initialParams.job_id = initialJobId;
    }
    if (initialPipelineType) {
      initialParams.pipelineType = initialPipelineType;
    }
    if (initialPipeline) {
      initialParams.pipeline = initialPipeline;
    }
    if (initialStatusParams.length > 0) {
      initialParams.status = initialStatusParams.join(',');
    }
    if (initialRatingParams.length > 0) {
      initialParams.rating = initialRatingParams.join(',');
    }

    getAllCandidates(initialParams);

    getCompanyJobs();
    if (candidateLimit === undefined) {
      getCandidateLimit();
    }

    setIsInitialized(true);

    setTimeout(() => {
      isPageReload.current = false;
    }, 3000);

    return () => {
      resetCandidatesId();
    };
  }, []);

  useEffect(() => {
    if (companyJobs && companyJobs.length) {
      setJobs(companyJobs);
    }
  }, [companyJobs]);

  // Initialize filter display values based on URL parameters
  useEffect(() => {
    if (companyJobs && companyJobs.length) {
      const urlJobParam = getUrlSearchParam('job');
      const urlPipelineParam = getUrlSearchParam('pipeline');
      const urlPipelineTypeParam = getUrlSearchParam('pipelineType');

      if (urlJobParam) {
        const job = companyJobs.find(
          (job) => parseInt(job.id) === parseInt(urlJobParam),
        );
        if (job) {
          setFilterbarContentJob(job.title);
        }
      } else {
        setFilterbarContentJob('');
      }

      if (urlJobParam) {
        const job = companyJobs.find(
          (job) => parseInt(job.id) === parseInt(urlJobParam),
        );
        if (job && job.pipelines && job.pipelines.length > 0) {
          if (urlPipelineParam) {
            const pipeline = job.pipelines.find(
              (pipeline) =>
                parseInt(pipeline.id) === parseInt(urlPipelineParam),
            );
            if (pipeline) {
              setFilterbarContentPipeline(pipeline.label);
            } else {
              setFilterbarContentPipeline('All');
            }
          } else {
            setFilterbarContentPipeline('All');
          }
        } else {
          setFilterbarContentPipeline('All');
        }
      } else if (urlPipelineTypeParam) {
        const pipeline = globalPipeline.find(
          (pipeline) =>
            parseInt(pipeline.type) === parseInt(urlPipelineTypeParam),
        );
        if (pipeline) {
          setFilterbarContentPipeline(pipeline.label);
        } else {
          setFilterbarContentPipeline('All');
        }
      } else {
        setFilterbarContentPipeline('All');
      }
    }
  }, [companyJobs]);

  // Close any open toolbar popover on outside click (mirrors the mockup: a
  // document click closes; popovers/buttons stopPropagation to stay open).
  useEffect(() => {
    const handler = () => setOpenPop(null);
    if (openPop) document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [openPop]);

  // Persist the grid/list view choice.
  useEffect(() => {
    try {
      localStorage.setItem('easyjobs_candidate_view', currentView);
    } catch (e) {}
  }, [currentView]);

  // ⌘K / Ctrl-K focuses the search field.
  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key || '').toLowerCase() === 'k') {
        e.preventDefault();
        if (searchRef.current) searchRef.current.focus();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const filteredJobs =
    jobs?.filter((job) =>
      job.title.toLowerCase().includes(jobNameSearchText.toLowerCase()),
    ) || [];

  useEffect(() => {
    if (selectedJob && companyJobs) {
      const job = companyJobs?.filter((job) => {
        return parseInt(job.id) === parseInt(selectedJob);
      });
      setAllStatus(job[0]?.pipelines);
    }
  }, [selectedJob, companyJobs]);

  const handlePageChange = (page) => {
    setPage(page);

    if (page > 1) {
      updateUrlSearchParam('pageNum', page.toString());
    } else {
      updateUrlSearchParam('pageNum', '');
    }

    setTimeout(() => saveFiltersToLocalStorage(), 0);

    apiCall({ page });
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setPage(1);
    setOpenPop(null);

    // 20 is the default — keep it out of the URL for clean links.
    updateUrlSearchParam('per_page', size === 20 ? '' : String(size));
    updateUrlSearchParam('pageNum', '');

    setTimeout(() => saveFiltersToLocalStorage(), 0);

    apiCall({ per_page: size, page: 1 });
  };

  const filterBySearch = (e) => {
    const newSearchText = e.target.value;
    setSearchText(newSearchText);

    updateUrlSearchParam('candidate', newSearchText);

    setPage(1);
    updateUrlSearchParam('pageNum', '');

    setTimeout(() => saveFiltersToLocalStorage(), 0);

    if (!timeoutId) {
      setTimeoutId(true);
      return () => {};
    }

    clearTimeout(timeoutId);
    const Id = setTimeout(() => {
      apiCall({
        candidate_name: newSearchText,
        page: 1,
      });
    }, 500);
    setTimeoutId(Id);
  };

  const filterByJob = (e) => {
    const newJobId = e.target.value;

    setPage(1);
    updateUrlSearchParam('pageNum', '');

    if (newJobId === 'select') {
      setSelectedJob(defaultSelectedJob);
      setAllStatus(undefined);
      setSelectedStatus(defaultSelectedPipelineStatus);
      setSelectedGlobalPipeline(defaultSelectedPipelineStatus);
      setFilterbarContentJob('');
      setFilterbarContentPipeline('All');

      updateUrlSearchParam('job', '');
      updateUrlSearchParam('pipeline', '');
      updateUrlSearchParam('pipelineType', '');

      setTimeout(() => saveFiltersToLocalStorage(), 0);

      apiCall({
        job_id: undefined,
        pipeline: undefined,
        pipelineType: undefined,
        page: 1,
      });
    } else {
      const selectedJobObj = companyJobs.filter((job) => {
        return parseInt(job.id) === parseInt(newJobId);
      })[0];
      setSelectedJob(newJobId);
      // Switch the Status filter from global pipelines to this job's pipelines immediately.
      setAllStatus(selectedJobObj?.pipelines);
      setSelectedStatus(defaultSelectedPipelineStatus);
      setSelectedGlobalPipeline(defaultSelectedPipelineStatus);

      setFilterbarContentJob(selectedJobObj?.title);
      setFilterbarContentPipeline('All');

      updateUrlSearchParam('job', newJobId);
      updateUrlSearchParam('pipeline', '');
      updateUrlSearchParam('pipelineType', '');

      setTimeout(() => saveFiltersToLocalStorage(), 0);

      apiCall({
        job_id: newJobId,
        pipeline: undefined,
        pipelineType: undefined,
        page: 1,
      });
    }
  };

  const handleGlobalPipelineChange = (e) => {
    const newPipelineType = e.target.checked ? e.target.value : '';

    if (e.target.checked) {
      setSelectedGlobalPipeline(newPipelineType);
    } else {
      setSelectedGlobalPipeline('');
    }

    setSelectedStatus(defaultSelectedPipelineStatus);

    setPage(1);

    updateUrlSearchParam('pipelineType', newPipelineType);
    updateUrlSearchParam('pipeline', '');
    updateUrlSearchParam('pageNum', '');

    setTimeout(() => saveFiltersToLocalStorage(), 0);

    const pipelineName = globalPipeline.filter((pipeline) => {
      return parseInt(pipeline.type) === parseInt(e.target.value);
    })[0]?.label;
    if (e.target.value === '') {
      setFilterbarContentPipeline('All');
    } else {
      setFilterbarContentPipeline(pipelineName);
    }

    apiCall({
      pipelineType: newPipelineType,
      pipeline: undefined,
      page: 1,
    });
  };

  const handlePipelineChange = (e) => {
    const newPipeline = e.target.checked ? e.target.value : '';

    if (e.target.checked) {
      setSelectedStatus(newPipeline);
    } else {
      setSelectedStatus('');
    }

    setSelectedGlobalPipeline(defaultSelectedPipelineStatus);

    setPage(1);

    updateUrlSearchParam('pipeline', newPipeline);
    updateUrlSearchParam('pipelineType', '');
    updateUrlSearchParam('pageNum', '');

    setTimeout(() => saveFiltersToLocalStorage(), 0);

    const pipelineName = allStatus.filter((status) => {
      return parseInt(status.id) === parseInt(e.target.value);
    })[0]?.label;
    if (e.target.value === '') {
      setFilterbarContentPipeline('All');
    } else {
      setFilterbarContentPipeline(pipelineName);
    }
    apiCall({
      pipeline: newPipeline,
      pipelineType: undefined,
      page: 1,
    });
  };

  const handleRatingChange = (e, index) => {
    const updatedCheckedState = ratingValues.map((item, position) =>
      index === position
        ? { ...item, selected: !item.selected }
        : { ...item, selected: item.selected },
    );

    let finalState;
    if (updatedCheckedState.every((item) => item.selected === false)) {
      finalState = defaultSelectedRating;
      setRatingValues(defaultSelectedRating);
    } else {
      finalState = updatedCheckedState;
      setRatingValues(updatedCheckedState);
    }

    const ratingFilter = finalState
      .filter((item) => item.selected)
      .map((item) => item.value);

    setPage(1);

    if (finalState.every((item) => item.selected === true)) {
      updateUrlSearchParams('rating', []);
    } else {
      updateUrlSearchParams('rating', ratingFilter);
    }
    updateUrlSearchParam('pageNum', '');

    setTimeout(() => saveFiltersToLocalStorage(), 0);

    apiCall({
      rating: ratingFilter.join(),
      page: 1,
    });
  };

  const handleHideStatusChange = (e, index) => {
    const updatedCheckedState = hideStatus.map((item, position) =>
      index === position
        ? { ...item, selected: !item.selected }
        : { ...item, selected: item.selected },
    );
    setHideStatus(updatedCheckedState);
    const hideStatusFilter = updatedCheckedState
      .filter((item) => item.selected)
      .map((item) => item.value);

    setPage(1);

    updateUrlSearchParams('status', hideStatusFilter);
    updateUrlSearchParam('pageNum', '');

    setTimeout(() => saveFiltersToLocalStorage(), 0);

    apiCall({
      status: hideStatusFilter.join(),
      page: 1,
    });
  };

  const handleReset = () => {
    setJobNameSearchText(defaultJobNameSearchText);
    setSelectedJob(defaultSelectedJob);
    setSelectedStatus(defaultSelectedPipelineStatus);
    setSelectedGlobalPipeline(defaultSelectedPipelineStatus);
    setHideStatus(defaultSelectedHideStatus);

    setRatingValues(defaultSelectedRating);
    setPage(1);

    setAllStatus(undefined);
    setFilterbarContentJob('');
    setFilterbarContentPipeline('All');

    updateUrlSearchParam('job', '');
    updateUrlSearchParam('pipelineType', '');
    updateUrlSearchParam('pipeline', '');
    updateUrlSearchParam('pageNum', '');
    updateUrlSearchParams('status', []);
    updateUrlSearchParams('rating', []);

    setTimeout(() => saveFiltersToLocalStorage(), 0);

    apiCall({
      job_id: undefined,
      pipelineType: undefined,
      pipeline: undefined,
      rating: undefined,
      status: undefined,
    });
  };

  // Like handleReset, but also clears the search term. Used by the empty-state
  // "Clear all filters" button so a no-result search can be fully cleared.
  const clearAllFilters = () => {
    setSearchText('');
    setJobNameSearchText(defaultJobNameSearchText);
    setSelectedJob(defaultSelectedJob);
    setSelectedStatus(defaultSelectedPipelineStatus);
    setSelectedGlobalPipeline(defaultSelectedPipelineStatus);
    setHideStatus(defaultSelectedHideStatus);
    setRatingValues(defaultSelectedRating);
    setPage(1);
    setAllStatus(undefined);
    setFilterbarContentJob('');
    setFilterbarContentPipeline('All');

    updateUrlSearchParam('candidate', '');
    updateUrlSearchParam('job', '');
    updateUrlSearchParam('pipelineType', '');
    updateUrlSearchParam('pipeline', '');
    updateUrlSearchParam('pageNum', '');
    updateUrlSearchParams('status', []);
    updateUrlSearchParams('rating', []);

    setTimeout(() => saveFiltersToLocalStorage(), 0);

    apiCall({
      candidate_name: undefined,
      job_id: undefined,
      pipelineType: undefined,
      pipeline: undefined,
      rating: undefined,
      status: undefined,
      page: 1,
    });
  };

  const apiCall = (params) => {
    getAllCandidates({
      candidate_name: searchText.length ? searchText : undefined,
      job_id: params?.job_id ? params.job_id : selectedJob,
      pipelineType: params?.pipelineType
        ? params.pipelineType
        : selectedGlobalPipeline,
      pipeline: params?.pipeline ? params.pipeline : selectedStatus,
      rating: ratingValues
        .filter((item) => item.selected)
        .map((item) => item.value)
        .join(),
      status: hideStatus
        .filter((item) => item.selected)
        .map((item) => item.value)
        .join(),
      per_page: pageSize,
      ...params,
    });
  };

  const handleClearSearch = () => {
    setSearchText('');
    setPage(1);
    updateUrlSearchParam('candidate', '');
    updateUrlSearchParam('pageNum', '');

    setTimeout(() => saveFiltersToLocalStorage(), 0);

    apiCall({
      candidate_name: undefined,
      page: 1,
    });
  };

  const handleClearFilterbarContentJob = () => {
    setFilterbarContentJob('');
    setFilterbarContentPipeline('All');
    setSelectedJob(defaultSelectedJob);
    setSelectedGlobalPipeline(defaultSelectedPipelineStatus);
    setSelectedStatus(defaultSelectedPipelineStatus);
    setAllStatus(undefined);
    setPage(1);

    updateUrlSearchParam('job', '');
    updateUrlSearchParam('pipeline', '');
    updateUrlSearchParam('pipelineType', '');
    updateUrlSearchParam('pageNum', '');

    setTimeout(() => saveFiltersToLocalStorage(), 0);

    apiCall({
      job_id: undefined,
      pipelineType: undefined,
      pipeline: undefined,
      page: 1,
    });
  };

  const handleClearFilterbarContentPipeline = () => {
    setFilterbarContentPipeline('All');
    setSelectedStatus(defaultSelectedPipelineStatus);
    setSelectedGlobalPipeline(defaultSelectedPipelineStatus);
    setPage(1);

    updateUrlSearchParam('pipelineType', '');
    updateUrlSearchParam('pipeline', '');
    updateUrlSearchParam('pageNum', '');

    setTimeout(() => saveFiltersToLocalStorage(), 0);

    apiCall({
      pipeline: undefined,
      pipelineType: undefined,
      page: 1,
    });
  };

  const clearRatingFilter = () => {
    setRatingValues(defaultSelectedRating);
    setPage(1);
    updateUrlSearchParams('rating', []);
    updateUrlSearchParam('pageNum', '');
    setTimeout(() => saveFiltersToLocalStorage(), 0);
    apiCall({ rating: undefined, page: 1 });
  };

  const clearHideStatusFilter = () => {
    setHideStatus(defaultSelectedHideStatus);
    setPage(1);
    updateUrlSearchParams('status', []);
    updateUrlSearchParam('pageNum', '');
    setTimeout(() => saveFiltersToLocalStorage(), 0);
    apiCall({ status: undefined, page: 1 });
  };

  // ─── New UI helpers ──────────────────────────────────────────────────────────
  const togglePop = (name) => setOpenPop((p) => (p === name ? null : name));
  const stub = (label) =>
    toast.info(`${label} — ${__('coming soon', 'easyjobs')}`, {
      autoClose: 1500,
    });

  const ratingActive = !ratingValues.every((i) => i.selected);
  const hideActive = hideStatus.some((i) => i.selected);
  const ratingLabel = ratingValues
    .filter((i) => i.selected)
    .map((i) => i.value)
    .join(', ');
  const hiddenLabel = hideStatus
    .filter((i) => i.selected)
    .map((i) => i.label)
    .join(', ');
  const sortLabel = (sortOptions.find((o) => o.v === sortBy) || sortOptions[0])
    .label;

  // Client-side sort of the current page only (no backend sort param yet).
  const baseData = allCandidates?.data || [];
  const sortedData = [...baseData];
  if (sortBy === 'az')
    sortedData.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  else if (sortBy === 'za')
    sortedData.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
  else if (sortBy === 'rated')
    sortedData.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  else if (sortBy === 'oldest') sortedData.reverse();
  // 'newest' keeps the API order

  const hasActiveFilters =
    !!filterbarContentJob ||
    (filterbarContentPipeline && filterbarContentPipeline !== 'All') ||
    ratingActive ||
    hideActive;
  // For the empty state, a search term counts as an active filter too (it has no
  // chip — it's cleared from the search box / the empty-state button).
  const hasAnyFilter = hasActiveFilters || searchText.length > 0;

  // The pager row (page controls + per-page selector) only shows when there is
  // more than one page — same condition the Pager uses to render.
  const showPager = !!(
    allCandidates &&
    allCandidates.total &&
    allCandidates.per_page &&
    allCandidates.total > allCandidates.per_page
  );
  const perPage = allCandidates?.per_page || 0;
  const currentPage = allCandidates?.current_page || 1;
  const totalCandidates = allCandidates?.total || 0;
  const rangeStart = totalCandidates ? (currentPage - 1) * perPage + 1 : 0;
  const rangeEnd = Math.min(currentPage * perPage, totalCandidates);

  return (
    <section className="ej-candidates">
      {/* Candidate-quota banner (80% / 90% / 100% escalation) */}
      <CandidateLimitNotice candidateLimit={candidateLimit} />

      {/* page title */}
      <div className="page-title">
        <div>
          <h1>{__('Candidates', 'easyjobs')}</h1>
        </div>
        <div className="pt-actions">
          <PlanUsage candidateLimit={candidateLimit} />
        </div>
      </div>

      {/* toolbar */}
      <div className="toolbar">
        <div className="tb-search">
          <Icon id="i-search" size={15} className="s-ic" />
          <input
            ref={searchRef}
            value={searchText}
            onChange={filterBySearch}
            placeholder={__('Search candidates by name…', 'easyjobs')}
          />
          {searchText.length > 0 && (
            <button
              className="s-clear"
              onClick={handleClearSearch}
              aria-label={__('Clear search', 'easyjobs')}
            >
              <Icon id="i-close" size={14} />
            </button>
          )}
        </div>

        {/* Status */}
        <div className="tb-ctrl">
          <button
            className={`tb-btn${
              filterbarContentPipeline && filterbarContentPipeline !== 'All'
                ? ' active-f'
                : ''
            }`}
            onClick={(e) => {
              e.stopPropagation();
              togglePop('status');
            }}
          >
            <Icon id="i-circle-dot" size={15} />
            {__('Status:', 'easyjobs')}{' '}
            <b>{filterbarContentPipeline || 'All'}</b>
            <Icon id="i-chev" size={13} className="chv" />
          </button>
          <div
            className={`popover${openPop === 'status' ? ' open' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            {allStatus ? (
              <>
                <div
                  className={`pop-opt${selectedStatus === '' ? ' sel' : ''}`}
                  onClick={() => {
                    handlePipelineChange({
                      target: { checked: true, value: '' },
                    });
                    setOpenPop(null);
                  }}
                >
                  <span className="cb">
                    <Icon id="i-check" size={11} />
                  </span>
                  {__('All', 'easyjobs')}
                </div>
                {allStatus.map((status, index) => (
                  <div
                    key={index}
                    className={`pop-opt${
                      String(selectedStatus) === String(status.id) ? ' sel' : ''
                    }`}
                    onClick={() => {
                      handlePipelineChange({
                        target: { checked: true, value: String(status.id) },
                      });
                      setOpenPop(null);
                    }}
                  >
                    <span className="cb">
                      <Icon id="i-check" size={11} />
                    </span>
                    {status.label}
                  </div>
                ))}
              </>
            ) : (
              <>
                <div
                  className={`pop-opt${
                    selectedGlobalPipeline === '' ? ' sel' : ''
                  }`}
                  onClick={() => {
                    handleGlobalPipelineChange({
                      target: { checked: true, value: '' },
                    });
                    setOpenPop(null);
                  }}
                >
                  <span className="cb">
                    <Icon id="i-check" size={11} />
                  </span>
                  {__('All', 'easyjobs')}
                </div>
                {globalPipeline.map((pipeline, index) => (
                  <div
                    key={index}
                    className={`pop-opt${
                      String(selectedGlobalPipeline) === String(pipeline.type)
                        ? ' sel'
                        : ''
                    }`}
                    onClick={() => {
                      handleGlobalPipelineChange({
                        target: { checked: true, value: String(pipeline.type) },
                      });
                      setOpenPop(null);
                    }}
                  >
                    <span className="cb">
                      <Icon id="i-check" size={11} />
                    </span>
                    {pipeline.label}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Job */}
        <div className="tb-ctrl">
          <button
            className={`tb-btn${filterbarContentJob ? ' active-f' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              togglePop('job');
            }}
          >
            <Icon id="i-brief" size={15} />
            {__('Job:', 'easyjobs')}{' '}
            <b>
              {filterbarContentJob
                ? __('Selected', 'easyjobs')
                : __('All', 'easyjobs')}
            </b>
            <Icon id="i-chev" size={13} className="chv" />
          </button>
          <div
            className={`popover wide${openPop === 'job' ? ' open' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pop-search">
              <Icon id="i-search" size={14} />
              <input
                value={jobNameSearchText}
                onChange={(e) => setJobNameSearchText(e.target.value)}
                placeholder={__('Search jobs…', 'easyjobs')}
              />
            </div>
            <div className="pop-list">
              {filteredJobs.map((job, index) => (
                <div
                  key={index}
                  className={`pop-opt${
                    String(selectedJob) === String(job.id) ? ' sel' : ''
                  }`}
                  onClick={() => {
                    filterByJob({ target: { value: String(job.id) } });
                    setOpenPop(null);
                  }}
                >
                  <span className="cb">
                    <Icon id="i-check" size={11} />
                  </span>
                  {job.title}
                </div>
              ))}
              {filteredJobs.length === 0 && (
                <div className="pop-empty">
                  {__('No jobs found', 'easyjobs')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="tb-ctrl">
          <button
            className={`tb-btn ghost${
              ratingActive || hideActive ? ' active-f' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation();
              togglePop('filter');
            }}
          >
            <Icon id="i-filter" size={15} />
            {__('Filter', 'easyjobs')}
          </button>
          <div
            className={`popover wide${openPop === 'filter' ? ' open' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pop-group">{__('Rating', 'easyjobs')}</div>
            {ratingValues.map((rating, index) => (
              <div
                key={index}
                className={`pop-opt${rating.selected ? ' on' : ''}`}
                onClick={() => handleRatingChange({}, index)}
              >
                <span className="cb">
                  <Icon id="i-check" size={11} />
                </span>
                <span>
                  {rating.value} {__('star', 'easyjobs')}
                </span>
              </div>
            ))}
            <div className="pop-sep" />
            <div className="pop-group">{__('Hide status', 'easyjobs')}</div>
            {hideStatus.map((status, index) => (
              <div
                key={index}
                className={`pop-opt${status.selected ? ' on' : ''}`}
                onClick={() => handleHideStatusChange({}, index)}
              >
                <span className="cb">
                  <Icon id="i-check" size={11} />
                </span>
                <span>{status.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="tb-ctrl">
          <button
            className="tb-btn"
            onClick={(e) => {
              e.stopPropagation();
              togglePop('sort');
            }}
          >
            <Icon id="i-updown" size={15} />
            {__('Sort:', 'easyjobs')} <b>{sortLabel}</b>
            <Icon id="i-chev" size={13} className="chv" />
          </button>
          <div
            className={`popover${openPop === 'sort' ? ' open' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            {sortOptions.map((o) => (
              <div
                key={o.v}
                className={`pop-opt${sortBy === o.v ? ' sel' : ''}`}
                onClick={() => {
                  setSortBy(o.v);
                  setOpenPop(null);
                }}
              >
                <span className="rk">
                  <Icon id="i-check" size={14} />
                </span>
                {o.label}
              </div>
            ))}
          </div>
        </div>

        {/* view toggle */}
        <div className="view-toggle">
          <button
            className={`vt${currentView === 'grid' ? ' on' : ''}`}
            onClick={() => setCurrentView('grid')}
            aria-label={__('Grid view', 'easyjobs')}
          >
            <Icon id="i-grid" size={16} />
          </button>
          <button
            className={`vt${currentView === 'list' ? ' on' : ''}`}
            onClick={() => setCurrentView('list')}
            aria-label={__('List view', 'easyjobs')}
          >
            <Icon id="i-list" size={16} />
          </button>
        </div>
      </div>

      {/* active filter chips */}
      {hasActiveFilters && (
        <div className="chips">
          {filterbarContentJob && (
            <span className="chip">
              <b>
                {__('Job:', 'easyjobs')} {filterbarContentJob}
              </b>
              <button
                className="x"
                onClick={handleClearFilterbarContentJob}
                aria-label={__('Remove', 'easyjobs')}
              >
                <Icon id="i-close" size={12} />
              </button>
            </span>
          )}
          {filterbarContentPipeline && filterbarContentPipeline !== 'All' && (
            <span className="chip">
              <b>
                {__('Status:', 'easyjobs')} {filterbarContentPipeline}
              </b>
              <button
                className="x"
                onClick={handleClearFilterbarContentPipeline}
                aria-label={__('Remove', 'easyjobs')}
              >
                <Icon id="i-close" size={12} />
              </button>
            </span>
          )}
          {ratingActive && (
            <span className="chip">
              <b>
                {__('Rating:', 'easyjobs')} {ratingLabel}
              </b>
              <button
                className="x"
                onClick={clearRatingFilter}
                aria-label={__('Remove', 'easyjobs')}
              >
                <Icon id="i-close" size={12} />
              </button>
            </span>
          )}
          {hideActive && (
            <span className="chip">
              <b>
                {__('Hidden:', 'easyjobs')} {hiddenLabel}
              </b>
              <button
                className="x"
                onClick={clearHideStatusFilter}
                aria-label={__('Remove', 'easyjobs')}
              >
                <Icon id="i-close" size={12} />
              </button>
            </span>
          )}
          <button className="clear-all" onClick={handleReset}>
            {__('Clear all', 'easyjobs')}
          </button>
        </div>
      )}

      {/* content */}
      {sortedData.length > 0 ? (
        currentView === 'grid' ? (
          <div className="c-grid" id="ej-all-candidates">
            {sortedData.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onStub={stub}
                onNavigate={handleCandidateNavigation}
              />
            ))}
          </div>
        ) : (
          <div className="c-list-card surface">
            <div className="tbl-scroll">
              <table className="ltbl">
                <thead>
                  <tr>
                    <th>{__('Name', 'easyjobs')}</th>
                    <th>{__('Job Applied', 'easyjobs')}</th>
                    <th>{__('Status', 'easyjobs')}</th>
                    <th>{__('Rating', 'easyjobs')}</th>
                    <th>{__('Applied', 'easyjobs')}</th>
                    <th>{__('Activity', 'easyjobs')}</th>
                    <th className="right">{__('Actions', 'easyjobs')}</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((candidate) => (
                    <CandidateRow
                      key={candidate.id}
                      candidate={candidate}
                      onStub={stub}
                      onNavigate={handleCandidateNavigation}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : loading ? (
        <CandidateSkeleton
          view={currentView}
          count={Math.min(pageSize || 20, 20)}
        />
      ) : (
        <div className="c-empty">
          <div className="ic">
            <Icon id="i-users" size={24} />
          </div>
          <h3>
            {hasAnyFilter
              ? __('No candidates match these filters', 'easyjobs')
              : __('No candidates found', 'easyjobs')}
          </h3>
          <p>
            {__(
              'Try adjusting your filters or clearing them to see more candidates.',
              'easyjobs',
            )}
          </p>
          {hasAnyFilter && (
            <button className="btn-outline" onClick={clearAllFilters}>
              {__('Clear all filters', 'easyjobs')}
            </button>
          )}
        </div>
      )}

      {/* pagination — info (left) · pages (center) · per-page (right) */}
      {showPager && (
        <div className="c-pager">
          <span className="info tnum">
            {__('Showing', 'easyjobs')} {rangeStart}–{rangeEnd}{' '}
            {__('of', 'easyjobs')} {totalCandidates}{' '}
            {__('candidates', 'easyjobs')}
          </span>
          <div className="pg-center">
            <Pager
              pageSize={perPage}
              current={currentPage}
              total={totalCandidates}
              onChange={handlePageChange}
              showInfo={false}
            />
          </div>
          <div className="tb-ctrl psize">
            <button
              className="tb-btn"
              onClick={(e) => {
                e.stopPropagation();
                togglePop('psize');
              }}
            >
              <b>{pageSize}</b> {__('per page', 'easyjobs')}
              <Icon id="i-chev" size={13} className="chv" />
            </button>
            <div
              className={`popover up${openPop === 'psize' ? ' open' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              {[20, 50, 100].map((n) => (
                <div
                  key={n}
                  className={`pop-opt${pageSize === n ? ' sel' : ''}`}
                  onClick={() => handlePageSizeChange(n)}
                >
                  <span className="rk">
                    <Icon id="i-check" size={14} />
                  </span>
                  {n} {__('per page', 'easyjobs')}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Candidates);
