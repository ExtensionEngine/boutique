import generateActions from '@/common/store/helpers/actions';
const { get, fetch, save, remove } = generateActions('/programs');

export { get, fetch, save, remove };
