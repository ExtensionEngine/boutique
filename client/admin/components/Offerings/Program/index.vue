<template>
  <v-container fluid>
    <router-view
      v-if="program"
      :key="programId"
      :offering="program.enrollmentOffering"
      :program="program" />
  </v-container>
</template>

<script>
import api from '@/admin/api/program';

export default {
  name: 'program-container',
  props: {
    programId: { type: Number, required: true }
  },
  data: () => ({ program: null }),
  async created() {
    this.program = await api.get(this.programId);
  }
};
</script>
