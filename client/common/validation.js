import { upperCaseFirst as capitalize } from 'change-case';
import enrollmentApi from '@/admin/api/enrollment';
import programApi from '@/admin/api/program';
import userApi from '@/admin/api/user';
import VeeValidate from 'vee-validate';

export const registerRule = (name, rule) => VeeValidate.Validator.extend(name, rule);

registerRule('alphanumerical', {
  getMessage: field => `${capitalize(field)} field must contain at least 1 letter and 1 numeric value.`,
  validate: value => /\d/.test(value) && /[a-zA-Z]/.test(value)
});
registerRule('unique:program.name', uniqueProp('name', {
  getMessage: (field, args, { name }) => `Program named "${name}" already exists.`,
  isDirty: (value, initialValue) => value.toLowerCase() !== initialValue.toLowerCase(),
  search: programApi.fetch.bind(programApi),
  deleted: true
}));
registerRule('unique:user.email', uniqueProp('email', {
  message: 'Email is not unique!',
  search: userApi.fetch.bind(userApi),
  deleted: true
}));
registerRule('unique:enrollment', uniqueProp('studentId', {
  message: 'Learner is already enrolled!',
  search: enrollmentApi.fetch.bind(enrollmentApi)
}));

export default VeeValidate;

const getOptions = ({ inherit = false } = {}) => {
  if (inherit) return { inject: ['$validator'] };
  return { $_veeValidate: { validator: 'new' } };
};

const mixin = ({ rules = {}, ...config } = {}) => ({
  ...getOptions(config),
  created() {
    Object.keys(rules).forEach(name => {
      if (this.$validator.rules[name]) return;
      this.$validator.extend(name, rules[name]);
    });
  }
});

export const withValidation = mixin;

export function uniqueProp(prop, { message, search, ...options } = {}) {
  const {
    getMessage = () => message,
    isChanged = (value, oldValue) => value !== oldValue,
    deleted = false
  } = options;
  return {
    getMessage,
    validate: async (value, [options]) => {
      let { where, initialValue } = options || {};
      where = { ...where, [prop]: value };
      if (!isChanged(value, initialValue)) return true;
      const [data] = getItems(await search({ params: { ...where, deleted } }));
      return { valid: !data, data };
    }
  };

  function getItems(result) {
    if (Array.isArray(result)) return result;
    if (Array.isArray(result.items)) return result.items;
  }
}
