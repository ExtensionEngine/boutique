import Content from '@/admin/components/Program/Content';
import Enrollments from '@/admin/components/Program/Enrollments';
import get from 'lodash/get';
import NotFound from '@/admin/components/common/NotFound';
import Program from '@/admin/components/Program';
import role from '@/../common/config/role';
import Router from 'vue-router';
import Settings from '@/admin/components/Program/Settings';
import store from './store';
import Users from '@/admin/components/users';
import Vue from 'vue';

Vue.use(Router);

const parseProgramId = ({ params }) => ({
  programId: parseInt(params.programId, 10)
});

// Handle 404
const fallbackRoute = { path: '*', component: NotFound };

const router = new Router({
  routes: [{
    path: '',
    name: 'users',
    component: Users,
    meta: { auth: true }
  }, {
    path: '/programs/:programId',
    name: 'program',
    component: Program,
    props: parseProgramId,
    children: [{
      path: '',
      name: 'enrollments',
      component: Enrollments,
      props: parseProgramId
    }, {
      path: 'content',
      name: 'importedContent',
      component: Content,
      props: parseProgramId
    }, {
      path: 'settings',
      name: 'settings',
      component: Settings,
      props: parseProgramId
    }]
  }, fallbackRoute]
});

router.beforeEach((to, from, next) => {
  const user = get(store.state, 'auth.user');
  const isNotAuthenticated = to.matched.some(it => it.meta.auth) && !user;
  const isNotAuthorized = user && user.role !== role.ADMIN;
  if (isNotAuthenticated || isNotAuthorized) return loadMainSpa();
  next();
});

const loadMainSpa = () => window.location.replace(window.location.origin);

export default router;
