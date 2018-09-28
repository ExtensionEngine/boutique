import Auth from '@/student/components/auth';
import Container from '@/student/components/Container/index';
import Content from '@/student/components/Content/index';
import ForgotPassword from '@/student/components/auth/ForgotPassword';
import get from 'lodash/get';
import Home from '@/student/components/index';
import Login from '@/student/components/auth/Login';
import NotFound from '@/admin/components/common/NotFound';
import ResetPassword from '@/student/components/auth/ResetPassword';
import role from '@/../common/config/role';
import Router from 'vue-router';
import store from './store';
import StudentRoot from '@/student/components/Greet';
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
    name: 'home',
    component: Home,
    meta: { auth: true },
    children: [{
      path: '',
      name: 'content',
      component: Content
    }, {
      path: '/container/:containerId',
      name: 'container',
      component: Container
    }, {
      path: '/greet',
      name: 'greet',
      component: StudentRoot
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
