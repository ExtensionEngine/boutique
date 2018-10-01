import Auth from '@/student/components/auth';
import Container from '@/student/components/Container/index';
import Courseware from '@/student/components/Courseware/index';
import ForgotPassword from '@/student/components/auth/ForgotPassword';
import get from 'lodash/get';
import LearnerHome from '@/student/components/Home/index';
import LearnerRoot from '@/student/components/index';
import Login from '@/student/components/auth/Login';
import NotFound from '@/admin/components/common/NotFound';
import ResetPassword from '@/student/components/auth/ResetPassword';
import role from '@/../common/config/role';
import Router from 'vue-router';
import store from './store';
import Vue from 'vue';

Vue.use(Router);

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
    name: 'learner-root',
    component: LearnerRoot,
    meta: { auth: true },
    children: [{
      path: '',
      name: 'learner-home',
      component: LearnerHome
    }, {
      path: 'courseware',
      name: 'courseware',
      component: Courseware
    }, {
      path: 'container/:containerId',
      name: 'container',
      component: Container
    }]
  }, fallbackRoute]
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
