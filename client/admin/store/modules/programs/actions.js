import generateActions from '@/common/store/helpers/actions';
const { get, fetch, save, setApiUrl } = generateActions('/programs');

export { get, fetch, save, setApiUrl };
