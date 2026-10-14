import React, { useEffect } from 'react';
import {
  Redirect,
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from 'react-router-dom';
import Routs from './util/routs';
import { Provider } from 'react-redux';
import CreateJob from './components/Job/CreateJob';
import { applyMiddleware, createStore, compose } from 'redux';
import rootReducer from './redux/reducers';
import createSagaMiddleware from 'redux-saga';
import sagas from './redux/sagas';
import { ToastContainer } from 'react-toastify';
import Landing from './components/Landing/index';
import Header from './layouts/header/index';
import { manipulateWpMenu } from './util/helper';
import IconSprite from './util/IconSprite';
const sagaMiddleware = createSagaMiddleware();
// Only wire up the Redux DevTools enhancer when the browser extension is
// actually present. Previously `compose(applyMiddleware(...), window.__REDUX_DEVTOOLS_EXTENSION__ && ...())`
// passed `undefined` as an enhancer whenever devtool was enabled but the
// extension wasn't installed, which made Redux call `undefined.apply(...)` and
// threw "Cannot read properties of undefined (reading 'apply')" — crashing the
// whole admin app before React could mount.
const composeEnhancers =
  easyJobsJs.devtool &&
  easyJobsJs.devtool.toString() === '1' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;
const store = createStore(
  rootReducer(),
  composeEnhancers(applyMiddleware(sagaMiddleware)),
);
sagaMiddleware.run(sagas);

const App = () => {
  useEffect(() => {
    manipulateWpMenu();
    // Hide the wp-header-end HR; it has physical height (visibility:hidden ≠ display:none)
    const wrap = document.getElementById('easyjobs-react')?.closest('.wrap');
    if (wrap) {
      const hr = wrap.querySelector('hr.wp-header-end');
      if (hr) hr.style.display = 'none';
    }
    // Tag body so we can neutralize WP admin wrapper spacing for a flush, full-bleed app shell.
    // Scoped to body.ej-app-active so it never leaks to other admin pages.
    document.body.classList.add('ej-app-active');
    return () => {
      document.body.classList.remove('ej-app-active');
    };
  }, []);
  return (
    <Provider store={store}>
      <IconSprite />
      <Router>
        <Switch>
          {easyJobsJs.easyjobs_api_connected ? (
            <>
              <Header />
              {/*Enter your protected routs here*/}
              <div className="content-area__body">
                <Route component={Routs} />
              </div>
            </>
          ) : (
            <Route path={'/'} render={(props) => <Landing {...props} />} />
          )}
        </Switch>
        <ToastContainer />
      </Router>
    </Provider>
  );
};

export default App;
