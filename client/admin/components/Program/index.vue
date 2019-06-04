<template>
  <v-layout :key="programId" column>
    <v-breadcrumbs v-if="program" :items="items" divider="/" class="py-1"/>
    <v-flex>
      <v-tabs color="#f5f5f5" class="mt-0">
        <v-tab :to="{ name: 'enrollments', params: { programId } }" ripple>
          Enrollments
        </v-tab>
        <v-tab :to="{ name: 'importedContent', params: { programId } }" ripple>
          Content
        </v-tab>
        <v-tab :to="{ name: 'programSettings', params: { programId } }" ripple>
          Settings
        </v-tab>
      </v-tabs>
      <router-view v-if="program" :program="program"/>
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
    items() {
      return [
        { text: 'Programs', disabled: true },
        { text: this.program.name, disabled: true }
      ];
    }
  },
  methods: mapActions('programs', ['get']),
  created() {
    this.get(this.programId);
  }
};
</script>
