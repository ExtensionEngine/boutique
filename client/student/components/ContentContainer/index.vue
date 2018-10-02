<template>
  <div class="container">
    <nav class="navbar">
      <router-link
        v-for="it in siblings"
        :key="it.id"
        :to="{
          name: 'content-container',
          params: { containerId: it.container.id}}"
        class="navbar-item">
        {{ it.name }}
      </router-link>
    </nav>
    <teaching-elements
      :containerId="containerId"
      :courseId="activity.courseId"
      :key="containerId"/>
  </div>
</template>

<script>
import filter from 'lodash/filter';
import find from 'lodash/find';
import { mapGetters } from 'vuex';
import TeachingElements from './TeachingElements';

export default {
  name: 'content-container',
  computed: {
    ...mapGetters('learner', ['courseware']),
    containerId() {
      return this.$route.params.containerId;
    },
    activity() {
      return find(this.courseware, { container: { id: this.containerId } });
    },
    siblings() {
      return filter(this.courseware, { parentId: this.activity.parentId });
    }
  },
  components: { TeachingElements }
};
</script>

<style lang="scss" scoped>
.router-link-exact-active {
  color: #3273dc;
  background-color: whitesmoke;
}
</style>
