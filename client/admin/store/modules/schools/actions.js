import generateActions from '@/common/store/helpers/actions';
const { fetch, reset, upload, remove } = generateActions('/schools');

export { fetch, reset, upload, remove };
