import generateActions from '@/common/store/helpers/actions';
const { get, fetch, save } = generateActions('/cohorts');

export { get, fetch, save };
