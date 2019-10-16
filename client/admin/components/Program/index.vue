<template>
  <v-layout :key="programId" column>
    <v-breadcrumbs v-if="program" :items="breadcrumbs" class="py-1" />
    <v-flex xs12>
      <v-tabs color="#f5f5f5">
        <v-tab
          v-for="({ name, label }) in tabs"
          :key="name"
          :to="{ name, params: { programId } }"
          ripple>
          {{ label }}
        </v-tab>
      </v-tabs>
      <router-view v-if="program" :program="program" />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import find from 'lodash/find';

export default {
  name: 'program',
  props: { programId: { type: Number, required: true } },
  computed: {
    ...mapState('programs', { programs: 'items' }),
    program() {
      return find(this.programs, { id: this.programId });
    },
    breadcrumbs() {
      return [
        { text: 'Programs', disabled: true },
        { text: this.program.name, disabled: true }
      ];
    },
    tabs() {
      return [
        { name: 'enrollments', label: 'Enrollments' },
        { name: 'importedContent', label: 'Content' },
        { name: 'programSettings', label: 'Settings' }
      ];
    }
  },
  methods: mapActions('programs', ['get']),
  created() {
    this.get(this.programId);
  }
};
</script>
