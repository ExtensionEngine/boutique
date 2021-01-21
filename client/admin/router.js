import Content from '@/admin/components/Program/Content';
import Enrollments from '@/admin/components/Program/Enrollments';
import get from 'lodash/get';
import Groups from '@/admin/components/Groups';
import { navigateTo } from '@/common/navigation';
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
    path: '/',
    name: 'users',
    component: Users,
    meta: { auth: true }
  }, {
    path: '/groups',
    name: 'groups',
    component: Groups
  }, {
    path: '/programs/:programId',
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
      name: 'programSettings',
      component: Settings,
      props: parseProgramId
    }]
  }, fallbackRoute]
});

const isAdmin = user => user && user.role === role.ADMIN;

router.beforeEach((to, from, next) => {
  const user = get(store.state, 'auth.user');
  if (!isAdmin(user)) return navigateTo('/');
  return next();
});

export default router;
