import rules from './rules';
import VeeValidate from 'vee-validate';
export { default as uniqueProp } from './uniqueProp';

export default VeeValidate;
registerRules(rules, VeeValidate.Validator);

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

export function registerRules(rules = {}, validator = VeeValidate.Validator) {
  Object.keys(rules).forEach(name => validator.extend(name, rules[name]));
  return validator;
}
