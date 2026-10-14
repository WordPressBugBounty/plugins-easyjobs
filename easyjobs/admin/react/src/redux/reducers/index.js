import { combineReducers } from 'redux';
import jobReducer from './jobReducer';
import settingsReducer from './settingsReducer';
import addressReducer from './addressReducer';
import companyReducer from './companyReducer';
import dashboardReducer from './dashboardReducer';
import landingReducer from './landingReducer';
import candidateReducer from './candidateReducer';
import jobCandidatesReducer from './jobCandidatesReducer';
import pipelineReducer from './pipelineReducer';
import evaluationReducer from './evaluationReducer';
import messagesReducer from './messagesReducer';

export default () =>
  combineReducers({
    job: jobReducer,
    settings: settingsReducer,
    address: addressReducer,
    company: companyReducer,
    dashboard: dashboardReducer,
    landing: landingReducer,
    candidate: candidateReducer,
    jobCandidates: jobCandidatesReducer,
    pipelines: pipelineReducer,
    evaluation: evaluationReducer,
    messages: messagesReducer,
  });
