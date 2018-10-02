import api from '@/student/api/content';

export const fetchSyllabus = ({ commit }, programId) => {
  api.fetchSyllabus(programId).then(res => commit('fetchSyllabus', res));
};
