export const setPrograms = (state, programs) => {
  state.programs = programs;
};

export const selectProgram = (state, programId) => {
  state.selectedProgramId = programId;
};

export const setSyllabus = (state, syllabus) => {
  state.syllabus = syllabus;
};

export const setCoursewareQuery = (state, query) => {
  state.coursewareQuery = query;
};
