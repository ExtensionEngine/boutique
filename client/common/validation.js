import { upperCaseFirst as capitalize } from 'change-case';
import programApi from '@/admin/api/program';
import VeeValidate from 'vee-validate';

VeeValidate.Validator.extend('alphanumerical', {
  getMessage: field => `${capitalize(field)} field must contain at least 1 letter and 1 numeric value.`,
  validate: value => /\d/.test(value) && /[a-zA-Z]/.test(value)
});
VeeValidate.Validator.extend('unique:program-name', uniqueProp('name', {
  getMessage: (field, args, { name }) => `Program named "${name}" already exists.`,
  isDirty: (value, initialValue) => value.toLowerCase() !== initialValue.toLowerCase(),
  deleted: true,
  search: programApi.fetch.bind(programApi)
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
