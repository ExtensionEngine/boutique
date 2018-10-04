<template>
  <v-layout>
    <v-flex>
      <v-tabs color="#f5f5f5" class="mt-2">
        <v-tab :to="{ name: 'enrollments', params: { programId } }" ripple>
          Enrollments
        </v-tab>
        <v-tab :to="{ name: 'importedContent', params: { programId } }" ripple>
          Content
        </v-tab>
      </v-tabs>
      <router-view :key="programId"/>
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
    }
  },
  methods: mapActions('programs', ['get']),
  created() {
    this.get(this.programId);
  }
};
</script>
