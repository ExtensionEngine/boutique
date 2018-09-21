import generateActions from '@/common/store/helpers/actions';
const { fetch } = generateActions('/cohorts/1/content');

export { fetch };
