import generateActions from '@/common/store/helpers/actions';
const { get, fetch, save, remove } = generateActions('/user-groups');

export { get, fetch, save, remove };
