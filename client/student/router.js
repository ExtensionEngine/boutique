import Activity from '@/student/components/Programs/Activity/index';
import Auth from '@/student/components/auth';
import Courseware from '@/student/components/Programs/Courseware/index';
import ForgotPassword from '@/student/components/auth/ForgotPassword';
import get from 'lodash/get';
import Login from '@/student/components/auth/Login';
import NotFound from '@/admin/components/common/NotFound';
import Program from '@/student/components/Programs/Program';
import Programs from '@/student/components/Programs/index';
import ResetPassword from '@/student/components/auth/ResetPassword';
import role from '@/../common/config/role';
import Root from '@/student/components/index';
import Router from 'vue-router';
import store from './store';
import transform from 'lodash/transform';
import Vue from 'vue';

Vue.use(Router);

const parseParams = ({ params }) => {
  return transform(params, (acc, value, key) => {
    return (acc[key] = parseInt(value, 10));
  }, {});
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
    name: 'root',
    component: Root,
    meta: { auth: true },
    children: [{
      path: '',
      name: 'programs',
      component: Programs
    }, {
      path: 'programs/:programId',
      name: 'program',
      component: Program,
      props: parseParams,
      children: [
        {
          path: '',
          name: 'courseware',
          component: Courseware,
          props: parseParams
        }, {
          path: 'repository/:repositoryId/activity/:activityId/:containerId',
          name: 'activity',
          component: Activity,
          props: parseParams
        }
      ]
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
