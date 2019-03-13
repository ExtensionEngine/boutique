import Activity from '@/student/components/program/Activity';
import api from '@/student/api/preview';
import Auth from '@/student/components/auth';
import ContentContainer from '@/student/components/program/Activity/ContentContainer';
import Courseware from '@/student/components/program/Courseware';
import ForgotPassword from '@/student/components/auth/ForgotPassword';
import get from 'lodash/get';
import Home from '@/student/components';
import Login from '@/student/components/auth/Login';
import NotFound from '@/admin/components/common/NotFound';
import Program from '@/student/components/program';
import ProgramSelection from '@/student/components/ProgramSelection';
import ResetPassword from '@/student/components/auth/ResetPassword';
import role from '@/../common/config/role';
import Router from 'vue-router';
import store from './store';
import transform from 'lodash/transform';
import Vue from 'vue';

Vue.use(Router);

const parseParams = ({ params }) => {
  return transform(params, (acc, val, key) => (acc[key] = parseInt(val, 10)), {});
};

const getContainer = ({ params }) => {
  return { getContainer: () => api.getPreview(params.containerId) };
};

// Handle 404
const fallbackRoute = { path: '*', component: NotFound };

const router = new Router({
  routes: [{
    path: '/auth',
    name: 'auth',
    component: Auth,
    children: [{
      path: 'login',
      name: 'login',
      component: Login
    }, {
      path: 'forgot-password',
      name: 'forgot-password',
      component: ForgotPassword
    }, {
      path: 'reset-password/:token',
      name: 'reset-password',
      component: ResetPassword
    }]
  }, {
    path: '/',
    component: Home,
    meta: { auth: true },
    children: [{
      path: '',
      name: 'program-selection',
      component: ProgramSelection
    }, {
      path: 'programs/:programId',
      component: Program,
      props: parseParams,
      children: [{
        path: '',
        name: 'courseware',
        component: Courseware,
        props: parseParams
      }, {
        path: 'repository/:repositoryId/activity/:activityId/:containerId',
        name: 'activity',
        component: Activity,
        props: parseParams
      }]
    }]
  },
  {
    path: '/previewComponent/:containerId',
    name: 'preview',
    component: ContentContainer,
    props: getContainer
  },
  fallbackRoute]
});

router.beforeEach((to, from, next) => {
  const user = get(store.state, 'auth.user');
  const isNotAuthenticated = to.matched.some(it => it.meta.auth) && !user;
  if (isNotAuthenticated) return next({ name: 'login' });
  if (user && user.role === role.ADMIN) {
    document.location.replace(`${document.location.origin}/admin`);
  }
  return next();
});

export default router;
