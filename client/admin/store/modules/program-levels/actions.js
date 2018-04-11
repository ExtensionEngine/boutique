import generateActions from '@/common/store/helpers/actions';
const { get, fetch, save } = generateActions('/program-levels');

export { get, fetch, save };
