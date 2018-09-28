<template>
  <v-layout>
    <v-flex>
      <v-tabs color="#f5f5f5" class="mt-2">
        <v-tab :to="{ name: 'enrollments', params: { cohortId } }" ripple>
          Enrollments
        </v-tab>
        <v-tab :to="{ name: 'importedContent', params: { cohortId } }" ripple>
          Content
        </v-tab>
      </v-tabs>
      <router-view/>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import find from 'lodash/find';

export default {
  name: 'cohort',
  props: { cohortId: { type: Number, required: true } },
  computed: {
    ...mapState('cohorts', { cohorts: 'items' }),
    cohort() {
      return find(this.cohorts, { id: this.cohortId });
    }
  },
  methods: mapActions('cohorts', ['get']),
  created() {
    this.get(this.cohortId);
  }
};
</script>
