export const setPrograms = (state, programs) => {
  state.programs = programs;
};

export const selectProgram = (state, programId) => {
  state.selectedProgramId = programId;
};

export const fetchSyllabus = (state, syllabus) => {
  state.syllabus = syllabus;
};
