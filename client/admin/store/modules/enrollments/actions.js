import generateActions from '@/common/store/helpers/actions';
const { fetch, save } = generateActions('/enrollments');

export { fetch, save };
