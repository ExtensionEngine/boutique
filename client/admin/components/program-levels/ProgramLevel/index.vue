<template>
  <div>
    <h1 class="title">
      {{ programLevel && programLevel.name }}
    </h1>
    <div class="tabs">
      <ul>
        <li :class="{ 'active-link': $route.name === 'enrollments' }">
          <router-link
            :to="{ name: 'enrollments', params: { programLevelId } }">
            Enrollments
          </router-link>
        </li>
        <li :class="{ 'active-link': $route.name === 'importedContent' }">
          <router-link
            :to="{ name: 'importedContent', params: { programLevelId } }">
            Content
          </router-link>
        </li>
      </ul>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import find from 'lodash/find';

export default {
  name: 'program-level',
  props: { programLevelId: { type: Number, required: true } },
  computed: {
    ...mapState('programLevels', { programLevels: 'items' }),
    programLevel() {
      return find(this.programLevels, { id: this.programLevelId });
    }
  },
  methods: mapActions('programLevels', ['get']),
  created() {
    this.get(this.programLevelId.toString());
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
