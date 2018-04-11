import generateActions from '@/common/store/helpers/actions';
const { fetch, setApiUrl } = generateActions('/schools');

export { fetch, setApiUrl };
