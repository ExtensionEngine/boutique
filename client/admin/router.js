import AdminRoot from '@/admin/components/index';
import Auth from '@/common/components/auth';
import Cohort from '@/admin/components/cohorts/Cohort';
import Cohorts from '@/admin/components/cohorts';
import Content from '@/admin/components/cohorts/Cohort/Content';
import Enrollments from '@/admin/components/cohorts/Cohort/Enrollments';
import ForgotPassword from '@/common/components/auth/ForgotPassword';
import get from 'lodash/get';
import Login from '@/common/components/auth/Login';
import NotFound from '@/admin/components/common/NotFound';
import ResetPassword from '@/common/components/auth/ResetPassword';
import Router from 'vue-router';
import store from './store';
import Users from '@/admin/components/users';
import Vue from 'vue';

Vue.use(Router);

const parseCohortId = ({ params }) => ({
  cohortId: parseInt(params.cohortId, 10)
});

// Handle 404
const fallbackRoute = {
  path: '*',
  component: NotFound
};

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
    name: 'home',
    component: AdminRoot,
    meta: { auth: true },
    children: [{
      path: '',
      name: 'cohorts',
      component: Cohorts
    }, {
      path: '/cohorts/:cohortId',
      name: 'cohort',
      component: Cohort,
      props: parseCohortId,
      children: [{
        path: '',
        name: 'enrollments',
        component: Enrollments,
        props: parseCohortId
      }, {
        path: 'content',
        name: 'importedContent',
        component: Content,
        props: parseCohortId
      }]
    }, {
      path: '/users',
      name: 'users',
      component: Users
    }, fallbackRoute]
  }, fallbackRoute]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(it => it.meta.auth) && !get(store.state, 'auth.user')) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
