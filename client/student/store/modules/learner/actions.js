import api from '@/student/api/learner';

export const fetchPrograms = ({ commit }, learnerId) => {
  api.fetchPrograms(learnerId).then(res => commit('fetchPrograms', res));
};

export const selectProgram = ({ commit }, programId) => {
  commit('selectProgram', programId);
};

export const fetchSyllabus = ({ commit }, programId) => {
  api.fetchSyllabus(programId).then(res => commit('fetchSyllabus', res));
};
