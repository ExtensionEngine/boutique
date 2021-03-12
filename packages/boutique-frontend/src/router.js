import Activity from '@/components/program/Activity/index.vue';
import Auth from '@/components/auth/index.vue';
import Courseware from '@/components/program/Courseware/index.vue';
import ForgotPassword from '@/components/auth/ForgotPassword.vue';
import get from 'lodash/get';
import Home from '@/components/index.vue';
import Login from '@/components/auth/Login.vue';
import { navigateTo } from '@/common/navigation';
import NotFound from '@/admin/components/common/NotFound.vue';
import Preview from '@/components/preview/index.vue';
import Program from '@/components/program/index.vue';
import ProgramSelection from '@/components/ProgramSelection.vue';
import ResetPassword from '@/components/auth/ResetPassword.vue';
import { Role } from '@/common/config';
import Router from 'vue-router';
import store from './store';
import transform from 'lodash/transform';
import Vue from 'vue';

Vue.use(Router);

const parseParams = ({ params }) => {
  return transform(params, (acc, val, key) => (acc[key] = parseInt(val, 10)), {});
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
        path: 'repository/:repositoryId/activity/:activityId',
        name: 'activity',
        component: Activity,
        props: parseParams
      }]
    }]
  },
  {
    path: '/preview/:previewId',
    name: 'preview',
    component: Preview,
    props: parseParams
  },
  fallbackRoute]
});

const isAdmin = user => user && user.role === Role.ADMIN;
const requiresAuth = route => route.matched.some(it => it.meta.auth);

router.beforeEach((to, _from, next) => {
  const user = get(store.state, 'auth.user');
  if (requiresAuth(to) && !user) return next({ name: 'login' });
  return !isAdmin(user) ? next() : navigateTo('/admin');
});
export default router;
