<template>
  <div>
    <h1 class="title">{{ cohort && cohort.name }}</h1>
    <div class="tabs">
      <ul>
        <li :class="{ 'active-link': $route.name === 'enrollments' }">
          <router-link :to="{ name: 'enrollments', params: { cohortId } }">
            Enrollments
          </router-link>
        </li>
        <li :class="{ 'active-link': $route.name === 'importedContent' }">
          <router-link :to="{ name: 'importedContent', params: { cohortId } }">
            Content
          </router-link>
        </li>
      </ul>
    </div>
    <router-view/>
  </div>
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

<style lang="scss" scoped>
$active-link: #3273dc;

.active-link a {
  border-bottom-color: $active-link;
  color: $active-link;
}
</style>
