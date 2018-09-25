import generateActions from '@/common/store/helpers/actions';
const { fetch, get, save } = generateActions('/cohorts/1/content/4/container');

export { fetch, get, save };
