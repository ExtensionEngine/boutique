import generateActions from '@/common/store/helpers/actions';
const { get, fetch, save, setApiUrl } = generateActions('/program-levels');

export { get, fetch, save, setApiUrl };
