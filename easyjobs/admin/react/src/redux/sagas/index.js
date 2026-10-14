import { all, fork } from 'redux-saga/effects';
import jobSaga from './jobSaga';
import companySaga from './companySaga';
import addressSaga from './addressSaga';
import settingsSaga from './settingsSaga';
import dashboardSaga from './dashboardSaga';
import landingSaga from './landingSaga';
import candidateSaga from './candidateSaga';
import jobCandidatesSaga from './jobCandidatesSaga';
import pipelineSaga from './pipelineSaga';
import evaluationSaga from './evaluationSaga';
import messagesSaga from './messagesSaga';

export default function* root() {
  yield all([
    fork(jobSaga),
    fork(companySaga),
    fork(addressSaga),
    fork(settingsSaga),
    fork(dashboardSaga),
    fork(landingSaga),
    fork(candidateSaga),
    fork(jobCandidatesSaga),
    fork(pipelineSaga),
    fork(evaluationSaga),
    fork(messagesSaga),
  ]);
}
