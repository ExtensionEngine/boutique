import generateActions from '@/common/store/helpers/actions';
const { fetch } = generateActions('/districts');

export { fetch };
