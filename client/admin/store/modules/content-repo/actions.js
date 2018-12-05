import generateActions from '@/common/store/helpers/actions';
const { fetch, save, remove } = generateActions('/content-repo');

export { fetch, save, remove };
