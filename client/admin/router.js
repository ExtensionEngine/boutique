import Content from '@/admin/components/Offerings/Program/Content';
import Enrollments from '@/admin/components/Offerings/Enrollments';
import get from 'lodash/get';
import { navigateTo } from '@/common/navigation';
import NotFound from '@/admin/components/common/NotFound';
import Offerings from '@/admin/components/Offerings';
import Program from '@/admin/components/Offerings/Program';
import { Role } from '@/../common/config';
import Router from 'vue-router';
import Settings from '@/admin/components/Offerings/Program/Settings';
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
    path: '/offerings',
    name: 'offerings',
    component: Offerings,
    meta: { auth: true }
  }, {
    path: '/programs/:programId',
    component: Program,
    props: parseProgramId,
    children: [{
      path: '',
      name: 'programEnrollments',
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

const isAdmin = user => user && user.role === Role.ADMIN;

router.beforeEach((_to, _from, next) => {
  const user = get(store.state, 'auth.user');
  return isAdmin(user) ? next() : navigateTo('/');
});

export default router;
