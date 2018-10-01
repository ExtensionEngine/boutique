import forEach from 'lodash/forEach';
import Vue from 'vue';

export const fetchPrograms = (state, programs) => {
  forEach(programs, it => Vue.set(state.programs, it.id, it));
};

export const selectProgram = (state, programId) => {
  state.selectedProgram = programId;
};

export const fetchSyllabus = (state, syllabus) => {
  state.syllabus = syllabus;
};
