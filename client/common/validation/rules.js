import * as api from '@/admin/api';
import { upperCaseFirst as capitalize } from 'change-case';
import uniqueProp from './uniqueProp';

const rules = {};

rules.alphanumerical = {
  getMessage: field => `${capitalize(field)} field must contain at least 1 letter and 1 numeric value.`,
  validate: value => /\d/.test(value) && /[a-zA-Z]/.test(value)
};

rules['unique:program.name'] = uniqueProp('name', {
  getMessage: (field, args, { name }) => `Program named "${name}" already exists.`,
  isDirty: (value, initialValue) => value.toLowerCase() !== initialValue.toLowerCase(),
  search: api.program.fetch,
  deleted: true
});

rules['unique:user.email'] = uniqueProp('email', {
  message: 'Email is not unique!',
  search: api.user.fetch,
  deleted: true
});

rules['unique:enrollment'] = uniqueProp('studentId', {
  message: 'Learner is already enrolled!',
  search: api.enrollment.fetch
});

export default rules;
