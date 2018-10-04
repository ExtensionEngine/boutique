import generateActions from '@/common/store/helpers/actions';
const { get, fetch, save } = generateActions('/programs');

export { get, fetch, save };
