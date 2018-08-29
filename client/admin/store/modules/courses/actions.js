import generateActions from '@/common/store/helpers/actions';
const { fetch, save } = generateActions('/courses');

export { fetch, save };
