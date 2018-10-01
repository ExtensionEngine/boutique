export const fetchPrograms = (state, programs) => {
  state.programs = programs;
};

export const selectProgram = (state, programId) => {
  state.selectedProgram = programId;
};

export const fetchSyllabus = (state, syllabus) => {
  state.syllabus = syllabus;
};
