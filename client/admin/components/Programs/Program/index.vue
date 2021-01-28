<template>
  <router-view v-if="program" :key="programId" :program="program" />
</template>

<script>
import { mapActions, mapState } from 'vuex';
import find from 'lodash/find';

export default {
  name: 'program-container',
  props: {
    programId: { type: Number, required: true }
  },
  computed: {
    ...mapState('programs', { programs: 'items' }),
    program: vm => find(vm.programs, { id: vm.programId })
  },
  methods: mapActions('programs', ['get']),
  created() {
    this.get(this.programId);
  }
};
</script>
