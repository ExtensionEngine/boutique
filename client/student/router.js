import Auth from '@/common/components/auth';
import Container from '@/student/components/Container/index';
import Content from '@/student/components/Content/index';
import ForgotPassword from '@/common/components/auth/ForgotPassword';
import get from 'lodash/get';
import Greet from '@/student/components/Greet';
import Home from '@/student/components/index';
import Login from '@/common/components/auth/Login';
import NotFound from '@/common/components/NotFound';
import ResetPassword from '@/common/components/auth/ResetPassword';
import Router from 'vue-router';
import store from './store';
import Vue from 'vue';

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
      component: Greet
    }]
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
