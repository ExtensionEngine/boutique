<template>
  <div class="elements">
    <nav class="navbar">
      <router-link
        v-for="it in siblings"
        :key="it.id"
        :to="{ name: 'container', params: { containerId: getId(it)}}"
        class="navbar-item"
      >
        {{ it.meta.name }}
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
import get from 'lodash/get';
import head from 'lodash/head';
import { mapGetters } from 'vuex';
import TeachingElements from './TeachingElements';

export default {
  name: 'container',
  computed: {
    containerId() {
      return parseInt(this.$route.params.containerId, 10);
    },
    siblings() {
      const content = this.getContent();
      const parentId = get(head(filter(content, it => {
        return get(head(it.contentContainers), 'id', '') === this.containerId;
      })), 'parentId', '');
      return filter(this.getContent(), { parentId });
    }
  },
  methods: {
    ...mapGetters('content', ['getContent']),
    getId(it) {
      return head(it.contentContainers).id;
    }
  },
  components: { TeachingElements }
};
</script>

<style lang="scss" scoped>
.elements {
  padding: 30px 300px 100px;
}
</style>
