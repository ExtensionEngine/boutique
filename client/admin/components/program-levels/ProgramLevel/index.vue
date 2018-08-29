<template>
  <div>
    <h1 class="title">
      {{ programLevel && programLevel.name }}
    </h1>
    <div class="tabs">
      <ul>
        <li>
          <router-link
            :to="{ name: 'enrollments', params: { programLevelId: id } }"
            exact>
            Enrollments
          </router-link>
        </li>
        <li>
          <router-link
            :to="{ name: 'content', params: { programLevelId: id } }"
            exact>
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
  computed: {
    ...mapState('programLevels', { programLevels: 'items' }),
    id() {
      return parseInt(this.$route.params.programLevelId);
    },
    programLevel() {
      return find(this.programLevels, { id: this.id });
    }
  },
  methods: mapActions('programLevels', ['get']),
  created() {
    this.get(this.id.toString());
  }
};
</script>

<style lang="scss" scoped>
.router-link-active {
  border-bottom-color: #3273dc;
  color: #3273dc;
}
</style>
