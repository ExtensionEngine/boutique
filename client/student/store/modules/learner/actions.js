import contentApi from '@/student/api/content';
import learnerApi from '@/student/api/learner';

export const fetchPrograms = ({ commit }, learnerId) => {
  learnerApi.fetchPrograms(learnerId).then(res => commit('fetchPrograms', res));
};

export const fetchSyllabus = ({ commit }, programId) => {
  contentApi.fetchSyllabus(programId).then(res => commit('fetchSyllabus', res));
};
