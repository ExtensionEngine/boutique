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
  validate: (name, [program]) => {
    if (program && name === program.name) return true;
    return api.fetch({ params: { name, deleted: true } })
      .then(programs => ({
        valid: !programs.length,
        data: programs[0] && programs[0].name
      }));
  }
};

VeeValidate.Validator.extend('alphanumerical', alphanumerical);
VeeValidate.Validator.extend('unique-program-name', uniqueProgramName);

export default VeeValidate;

const mixin = ({ inherit = false } = {}) => {
  if (inherit) return { inject: ['$validator'] };
  return { $_veeValidate: { validator: 'new' } };
};

export const withValidation = mixin;
