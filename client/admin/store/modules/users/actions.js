import generateActions from '@/common/store/helpers/actions';
const { api, get, fetch, save, setApiUrl } = generateActions('/users');

const FormData = require('form-data');

const saveAvatar = (data, { blob, userId }) => {
  const formData = new FormData();
  formData.append('avatar', blob);

  return api.post(
    `/${userId}/image`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
    .then(({ status, data }) => { return { status, data }; });
};

export { get, fetch, save, setApiUrl, saveAvatar };
