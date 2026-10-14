import React, { useEffect, useState } from 'react';
import { matchPath, useHistory } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Settings from '../components/Settings/Settings';
import AllJobs from '../components/Job/AllJobs';
import CreateJob from '../components/Job/CreateJob';
import EditJob from '../components/Job/EditJob';
import Candidates from '../components/Candidate';
import CandidateDetails from '../components/Candidate/Details';
import Messages from '../components/Messages';
import JobCandidates from '../components/JobCandidates/';
import Pipeline from '../components/Pipeline/';
import Question from '../components/Evaluation/Questions';
import EditQuestion from '../components/Evaluation/Questions/EditQuestion';
import AddQuestion from '../components/Evaluation/Questions/AddQuestion';
import Assessment from '../components/Evaluation/Assessment';
import AddAssessment from '../components/Evaluation/Assessment/AddAssessment';
import EditAssessmnet from '../components/Evaluation/Assessment/EditAssessmnet';
import { connect } from 'react-redux';
import { getMinimalInfo } from '../redux/actions/companyActions';

function Routes(props) {
  const [Location, setLocation] = useState(location.search);
  const { company, getCompanyInfo } = props;
  const [matchedRoutes, setMatchedRoutes] = useState([]);
  const menuId = 'toplevel_page_easyjobs-admin';

  const routes = [
    {
      path: 'easyjobs-admin',
      component: Dashboard,
      exact: true,
    },
    {
      path: 'easyjobs-jobs',
      component: AllJobs,
      exact: true,
    },
    {
      path: 'easyjobs-create',
      component: CreateJob,
      exact: true,
    },
    {
      path: 'easyjobs-edit/:id',
      component: EditJob,
      exact: true,
    },
    {
      path: 'easyjobs-candidates',
      component: Candidates,
      exact: true,
    },
    {
      path: 'easyjobs-candidates/:id',
      component: CandidateDetails,
      exact: true,
    },
    {
      path: 'easyjobs-messages',
      component: Messages,
      exact: true,
    },
    {
      path: 'easyjobs-settings',
      component: Settings,
      exact: true,
    },
    {
      path: 'easyjobs-job-candidates/:id',
      component: JobCandidates,
      exact: true,
    },
    {
      path: 'easyjobs-pipeline/:id',
      component: Pipeline,
      exact: true,
    },
    {
      path: 'easyjobs-questions',
      component: Question,
      exact: true,
    },
    {
      path: 'easyjobs-questions-edit/:id',
      component: EditQuestion,
      exact: true,
    },
    {
      path: 'easyjobs-create-question',
      component: AddQuestion,
      exact: true,
    },
    {
      path: 'easyjobs-assessments',
      component: Assessment,
      exact: true,
    },
    {
      path: 'easyjobs-create-assessment',
      component: AddAssessment,
      exact: true,
    },
    {
      path: 'easyjobs-assessment-edit/:id',
      component: EditAssessmnet,
      exact: true,
    },
    {
      component: <></>,
    },
  ];
  let history = useHistory();
  history.listen(() => {
    setLocation(location.search);
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(history.location.search);
    const page = searchParams.get('page');
    const id = searchParams.get('id');
    const pathname = page + (id ? `/${id}` : '');
    const _matchedRoutes = [];
    const preservedKeys = ['id', 'page'];
    const m = {
      isExact: true,
      params: {},
      path: 'easyjobs-settings&tab=subscription',
      url: 'easyjobs-settings&tab=subscription',
    };
    if (company && company.is_pro && company.subscription_expired) {
      handleMenuHighlight('easyjobs-settings');
      history.push('admin.php?page=easyjobs-settings&tab=subscription');
      _matchedRoutes.push(<Settings {...props} match={m} />);
    } else {
      for (let i = 0; i < routes.length; i += 1) {
        const { component: RouteComponent, ...rest } = routes[i];

        const match = matchPath(pathname, { ...rest });

        if (match) {
          for (const key of searchParams.keys()) {
            if (!preservedKeys.includes(key)) {
              match.params[key] = searchParams.get(key);
            }
          }
          handleMenuHighlight(pathname);
          _matchedRoutes.push(
            // @ts-ignore
            <RouteComponent {...props} match={match} />,
          );

          if (match.isExact) {
            break;
          }
        }
      }
    }
    setMatchedRoutes(_matchedRoutes);
  }, [Location]);

  useEffect(() => {
    if (company && company.is_pro && company.subscription_expired) {
      history.push('admin.php?page=easyjobs-settings&tab=subscription');
    }
  }, [company]);

  const handleMenuHighlight = (path) => {
    const menu = document.getElementById(menuId);
    if (!menu.classList.contains('wp-has-current-submenu')) {
      menu.classList.remove('wp-not-current-submenu');
      menu.classList.add('wp-has-current-submenu', 'wp-menu-open');
      const submenu = menu.querySelector('a');
      submenu.classList.remove('wp-not-current-submenu');
      submenu.classList.add('wp-has-current-submenu', 'wp-menu-open');
    }
    const menuItem = menu.querySelector(
      '.wp-submenu a[href="admin.php?page=' + path + '"]',
    );
    if (menuItem) {
      menuItem.parentNode.classList.add('current');
      menuItem.classList.add('current');
      let siblings = getSiblings(menuItem.parentNode);
      siblings.forEach((element) => {
        element.classList.remove('current');
        const child = element.querySelector('a');
        if (child && child.classList.contains('current')) {
          child.classList.remove('current');
        }
      });
    }
  };

  let getSiblings = function (e) {
    // for collecting siblings
    let siblings = [];
    // if no parent, return no sibling
    if (!e.parentNode) {
      return siblings;
    }
    // first child of the parent node
    let sibling = e.parentNode.firstChild;
    // collecting siblings
    while (sibling) {
      if (sibling.nodeType === 1 && sibling !== e) {
        siblings.push(sibling);
      }
      sibling = sibling.nextSibling;
    }
    return siblings;
  };

  const handleClick = function (e) {
    e.preventDefault();
    const path = this.getAttribute('href');
    if (path) {
      history.push(path);
    }
  };

  useEffect(() => {
    const ej = document.querySelectorAll('#' + menuId + ' a');
    ej.forEach((element) => {
      element.addEventListener('click', handleClick);
    });
    if (!company) {
      getCompanyInfo();
    }

    return () => {
      ej.forEach((element) => {
        element.removeEventListener('click', handleClick);
      });
    };
  }, []);
  return (
    <>
      {matchedRoutes.map((item) => {
        return item;
      })}
    </>
  );
}

const mapStateToProps = (state) => ({
  company: state.settings.companyInfo,
});

const mapDispatchToProps = (dispatch) => ({
  getCompanyInfo: () => dispatch(getMinimalInfo()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
