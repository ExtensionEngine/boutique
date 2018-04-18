import get from 'lodash/get';
import Router from 'vue-router';
import store from './store';
import Vue from 'vue';

import AdminRoot from '@/admin/components/index';
import Auth from '@/common/components/auth';
import Enrollments from '@/admin/components/program-levels/ProgramLevel/Enrollments';
import ForgotPassword from '@/common/components/auth/ForgotPassword';
import Login from '@/common/components/auth/Login';
import NotFound from '@/admin/components/common/NotFound';
import ProgramLevel from '@/admin/components/program-levels/ProgramLevel';
import ProgramLevels from '@/admin/components/program-levels';
import Programs from '@/admin/components/programs';
import ResetPassword from '@/common/components/auth/ResetPassword';
import Schools from '@/admin/components/schools';
import Users from '@/admin/components/users';

Vue.use(Router);

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
      name: 'programs',
      component: Programs
    }, {
      path: '/program-levels',
      name: 'programLevels',
      component: ProgramLevels
    }, {
      path: '/program-levels/:programLevelId',
      name: 'programLevel',
      component: ProgramLevel,
      children: [{
        path: '',
        name: 'enrollments',
        component: Enrollments
      }]
    }, {
      path: '/users',
      name: 'users',
      component: Users
    }, {
      path: '/schools',
      name: 'schools',
      component: Schools
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
