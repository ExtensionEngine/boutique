import generateActions from '@/common/store/helpers/actions';
const { api, get, fetch, save, setApiUrl } = generateActions('/users');
const uniqid = require('uniqid');
const mime = require('mime-types');

const FormData = require('form-data');

const saveAvatar = (data, { blob, userId, mimeType }) => {
  const formData = new FormData();
  formData.append('avatar', blob, `${uniqid()}.${mime.extension(mimeType)}`);
  return api.post(`/${userId}/image`, formData)
    .then(({ status, data }) => { return { status, data }; });
};

export { get, fetch, save, setApiUrl, saveAvatar };
