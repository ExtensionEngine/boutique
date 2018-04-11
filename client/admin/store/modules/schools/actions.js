import generateActions from '@/common/store/helpers/actions';
const { fetch } = generateActions('/schools');

export { fetch };
