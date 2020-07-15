import { alpha, email, is, max, mimes, min, required } from 'vee-validate/dist/rules';
import enrollmentApi from '@/admin/api/enrollment';
import { extend } from 'vee-validate';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import { messages } from 'vee-validate/dist/locale/en.json';
import programApi from '@/admin/api/program';
import snakeCase from 'lodash/snakeCase';
import userApi from '@/admin/api/user';

const after = {
  params: ['after'],
  validate: (value, { after }) => new Date(value) >= new Date(after),
  message: (name, { after }) => `${name} must be after ${after}`
};

const alphanumerical = {
  validate: value => (/\d/.test(value) && /[a-zA-Z]/.test(value)),
  message: 'The {_field_} field must contain at least 1 letter and 1 numeric value.'
};

const uniqueEmail = {
  params: ['userData'],
  validate: (email, { userData }) => {
    if (userData && email === userData.email) return true;
    return userApi.fetch({ params: { email } }).then(({ total }) => !total);
  },
  message: 'The {_field_} is not unique.'
};

const uniqueEnrollment = {
  params: ['learnerId', 'programId'],
  validate: (_, { learnerId, programId }) => {
    const params = { learnerId, programId };
    return enrollmentApi.fetch({ params }).then(({ total }) => !total);
  },
  message: 'Learner is already enrolled.'
};

const uniqueProgramName = {
  params: ['program'],
  validate: (name, { program }) => {
    const programName = get(program, 'name');
    if (programName && programName.toLowerCase() === name.toLowerCase()) return true;
    return programApi.fetch({ params: { name, deleted: true } })
      .then(([fetchedProgram]) => !fetchedProgram);
  },
  message: 'Program named {_value_} already exists'
};

const rules = {
  after,
  alpha,
  alphanumerical,
  email,
  is,
  max,
  min,
  mimes,
  required,
  uniqueEmail,
  uniqueEnrollment,
  uniqueProgramName
};

forEach(rules, (rule, name) => extend(snakeCase(name), { message: messages[name], ...rule }));
