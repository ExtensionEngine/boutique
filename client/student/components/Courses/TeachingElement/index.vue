<template>
  <div class="elements">
    <nav class="navbar">
      <router-link
        v-for="it in siblings"
        :key="it.id"
        :to="{ name: 'teaching-element', params: { teId: getId(it)}}"
        class="navbar-item"
      >
        {{ it.meta.name }}
      </router-link>
    </nav>
    <div class="columns is-multiline">
      <TE :teId="teId" :key="teId"></TE>
    </div>
  </div>
</template>

<script>
import filter from 'lodash/filter';
import get from 'lodash/get';
import head from 'lodash/head';
import { mapGetters } from 'vuex';
import TE from './Te';

export default {
  name: 'elements',
  computed: {
    teId() {
      return this.$route.params.teId;
    },
    siblings() {
      const content = this.getContent();
      const parentId = head(filter(content, it => {
        return get(head(it.contentContainers), 'id', '') === this.teId;
      })).parentId;
      return filter(this.getContent(), { parentId });
    }
  },
  methods: {
    ...mapGetters('courses', ['getContent']),
    getId(it) {
      return head(it.contentContainers).id;
    }
  },
  components: { TE }
};
</script>

<style lang="scss" scoped>
.elements {
  padding: 30px 300px 100px;
}

.element {
  padding: 10px !important;
}
</style>
