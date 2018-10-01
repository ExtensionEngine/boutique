<template>
  <div class="container">
    <nav class="columns navbar">
      <router-link
        v-for="it in siblings"
        :key="it.id"
        :to="{ name: 'container', params: { containerId: getId(it)}}"
        :class="{ 'active-link': containerId === getId(it) }"
        class="navbar-item"
      >
        {{ it.name }}
      </router-link>
    </nav>
    <div class="columns is-multiline">
      <TeachingElements
        :containerId="containerId"
        :key="containerId"
      />
    </div>
  </div>
</template>

<script>
import filter from 'lodash/filter';
import find from 'lodash/find';
import { mapGetters } from 'vuex';
import TeachingElements from './TeachingElements';

export default {
  name: 'container',
  computed: {
    ...mapGetters('learner', ['courseware']),
    containerId() {
      return this.$route.params.containerId;
    },
    activity() {
      return find(this.courseware, it => it.container.id === this.containerId);
    },
    parentId() {
      return this.activity.parentId;
    },
    siblings() {
      return filter(this.courseware, { parentId: this.parentId });
    }
  },
  methods: {
    getId(it) {
      return it.container.id;
    }
  },
  components: { TeachingElements }
};
</script>

<style lang="scss" scoped>
.active-link {
  color: #3273dc;
  background-color: whitesmoke;
}
</style>
