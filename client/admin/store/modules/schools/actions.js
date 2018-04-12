import generateActions from '@/common/store/helpers/actions';
const { fetch, reset, upload } = generateActions('/schools');

export { fetch, reset, upload };
