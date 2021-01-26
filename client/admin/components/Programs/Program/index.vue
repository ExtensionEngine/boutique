<template>
  <div :key="programId" class="ma-5">
    <v-breadcrumbs v-if="program" :items="breadcrumbs" class="pb-1" />
    <v-tabs background-color="transparent" class="ml-2">
      <v-tab
        v-for="({ name, label }) in tabs"
        :key="name"
        :to="{ name, params: { programId } }"
        exact ripple>
        {{ label }}
      </v-tab>
    </v-tabs>
    <router-view v-if="program" :program="program" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import find from 'lodash/find';

export default {
  name: 'program',
  props: {
    programId: { type: Number, required: true }
  },
  computed: {
    ...mapState('programs', { programs: 'items' }),
    program: vm => find(vm.programs, { id: vm.programId }),
    breadcrumbs: ({ program }) => [
      { text: 'Programs', disabled: true },
      { text: program.name, disabled: true }
    ],
    tabs: () => [
      { name: 'enrollments', label: 'Enrollments' },
      { name: 'importedContent', label: 'Content' },
      { name: 'programSettings', label: 'Settings' }
    ]
  },
  methods: mapActions('programs', ['get']),
  created() {
    this.get(this.programId);
  }
};
</script>

<style lang="scss" scoped>
.v-tab {
  margin-left: 0 !important;
}

.v-breadcrumbs {
  padding-left: 1.125rem;
}
</style>
