import Content from '@/admin/components/Programs/Program/Content';
import Enrollments from '@/admin/components/Programs/Program/Enrollments';
import get from 'lodash/get';
import Members from '@/admin/components/UserGroups/Members';
import { navigateTo } from '@/common/navigation';
import NotFound from '@/admin/components/common/NotFound';
import { numeric as numericParser } from '@/common/utils/paramsParser';
import Program from '@/admin/components/Programs/Program';
import Programs from '@/admin/components/Programs';
import role from '@/../common/config/role';
import Router from 'vue-router';
import Settings from '@/admin/components/Programs/Program/Settings';
import store from './store';
import UserGroups from '@/admin/components/UserGroups';
import Users from '@/admin/components/users';
import Vue from 'vue';

Vue.use(Router);

// Handle 404
const fallbackRoute = { path: '*', component: NotFound };

const router = new Router({
  routes: [{
    path: '/',
    name: 'users',
    component: Users,
    meta: { auth: true }
  }, {
    path: '/user-groups',
    name: 'user-groups',
    component: UserGroups,
    meta: { auth: true }
  }, {
    path: '/user-groups/:groupId/members',
    name: 'members',
    props: numericParser.params,
    component: Members,
    meta: { auth: true }
  }, {
    path: '/programs',
    name: 'programs',
    component: Programs,
    meta: { auth: true }
  }, {
    path: '/programs/:programId',
    component: Program,
    props: numericParser.params,
    children: [{
      path: '',
      name: 'enrollments',
      component: Enrollments,
      props: numericParser.params
    }, {
      path: 'content',
      name: 'importedContent',
      component: Content,
      props: numericParser.params
    }, {
      path: 'settings',
      name: 'programSettings',
      component: Settings,
      props: numericParser.params
    }]
  }, fallbackRoute]
});

const isAdmin = user => user && user.role === role.ADMIN;

router.beforeEach((_to, _from, next) => {
  const user = get(store.state, 'auth.user');
  return isAdmin(user) ? next() : navigateTo('/');
});

export default router;
