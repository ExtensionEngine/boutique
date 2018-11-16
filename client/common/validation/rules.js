import { upperCaseFirst as capitalize } from 'change-case';
import enrollmentApi from '@/admin/api/enrollment';
import programApi from '@/admin/api/program';
import uniqueProp from './uniqueProp';
import userApi from '@/admin/api/user';

const rules = {};

rules.alphanumerical = {
  getMessage: field => `${capitalize(field)} field must contain at least 1 letter and 1 numeric value.`,
  validate: value => /\d/.test(value) && /[a-zA-Z]/.test(value)
};

rules['unique:program.name'] = uniqueProp('name', {
  getMessage: (field, args, { name }) => `Program named "${name}" already exists.`,
  isDirty: (value, initialValue) => value.toLowerCase() !== initialValue.toLowerCase(),
  search: programApi.fetch.bind(programApi),
  deleted: true
});

rules['unique:user.email'] = uniqueProp('email', {
  message: 'Email is not unique!',
  search: userApi.fetch.bind(userApi),
  deleted: true
});

rules['unique:enrollment'] = uniqueProp('studentId', {
  message: 'Learner is already enrolled!',
  search: enrollmentApi.fetch.bind(enrollmentApi)
});

export default rules;
