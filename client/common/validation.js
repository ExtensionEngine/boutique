import api from '@/admin/api/program';
import VeeValidate from 'vee-validate';

const alphanumerical = {
  getMessage: field => {
    return `The ${field} field must contain at least 1 letter and 1 numeric value.`;
  },
  validate: value => {
    return (/\d/.test(value) && /[a-zA-Z]/.test(value));
  }
};

const uniqueProgramName = {
  getMessage: (field, args, data) => `Program named "${data}" already exists.`,
  validate: async (name, [program]) => {
    if (program && program.name.toLowerCase() === name.toLowerCase()) return true;
    const [fetchedProgram] = await api.fetch({ params: { name, deleted: true } });
    return {
      valid: !fetchedProgram,
      data: fetchedProgram && fetchedProgram.name
    };
  }
};

VeeValidate.Validator.extend('alphanumerical', alphanumerical);
VeeValidate.Validator.extend('unique-program-name', uniqueProgramName);

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
