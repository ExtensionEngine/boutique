import generateActions from '@/common/store/helpers/actions';
const { get, fetch, save, setApiUrl } = generateActions('/users');

export { get, fetch, save, setApiUrl };
