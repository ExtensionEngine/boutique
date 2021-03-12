import Content from '@/admin/components/Programs/Program/Content/index.vue';
import Enrollments from '@/admin/components/Programs/Program/Enrollments/index.vue';
import get from 'lodash/get';
import { navigateTo } from '@/common/navigation';
import NotFound from '@/admin/components/common/NotFound.vue';
import Program from '@/admin/components/Programs/Program/index.vue';
import Programs from '@/admin/components/Programs/index.vue';
import { Role } from '@/common/config';
import Router from 'vue-router';
import Settings from '@/admin/components/Programs/Program/Settings/index.vue';
import store from './store';
import Users from '@/admin/components/users/index.vue';
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
  }, {
    path: '/programs',
    name: 'programs',
    component: Programs,
    meta: { auth: true }
  }, fallbackRoute]
});

const isAdmin = user => user && user.role === Role.ADMIN;

router.beforeEach((_to, _from, next) => {
  const user = get(store.state, 'auth.user');
  return isAdmin(user) ? next() : navigateTo('/');
});

export default router;
