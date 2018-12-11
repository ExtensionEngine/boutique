import generateActions from '@/common/store/helpers/actions';
const { fetch, save } = generateActions('/content-repo');

export { fetch, save };
