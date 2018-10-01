import contentApi from '@/student/api/contentApi';
import learnerApi from '@/student/api/learnerApi';

export const fetchPrograms = ({ commit }, learnerId) => {
  learnerApi.fetchPrograms(learnerId).then(res => commit('fetchPrograms', res));
};

export const selectProgram = ({ commit }, programId) => {
  commit('selectProgram', programId);
};

export const fetchSyllabus = ({ commit }, programId) => {
  contentApi.fetchSyllabus(programId).then(res => commit('fetchSyllabus', res));
};
