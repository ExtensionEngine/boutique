<template>
  <div class="elements">
    <nav class="navbar">
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
    ...mapGetters('content', ['getContent']),
    containerId() {
      return this.$route.params.containerId;
    },
    content() {
      return find(this.getContent, it => it.container.id === this.containerId);
    },
    parentId() {
      return this.content.parentId;
    },
    siblings() {
      return filter(this.getContent, { parentId: this.parentId });
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
.elements {
  padding: 30px 300px 100px;
}

.active-link {
  color: #3273dc;
  background-color: whitesmoke;
}
</style>
