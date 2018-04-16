import generateActions from '@/common/store/helpers/actions';
import Resource from '@/common/store/helpers/resource';
const { fetch, reset, save, remove } = generateActions('/schools');

const upload = ({ commit, state }, { path, data }) => {
  const api = new Resource(state.$apiUrl);
  commit('setFlags', { isUploading: true });

  return api.post(path, data)
    .then(() => commit('setFlags', { isUploading: false }));
};

export { fetch, reset, save, upload, remove };
