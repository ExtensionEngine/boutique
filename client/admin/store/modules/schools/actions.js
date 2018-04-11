import generateActions from '@/common/store/helpers/actions';
const { fetch, upload } = generateActions('/schools');

export { fetch, upload };
