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
      return this.getSiblings()(this.containerId);
    }
  },
  methods: {
    ...mapGetters('content', ['getContent', 'getSiblings']),
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

.active-link {
  color: #3273dc;
  background-color: whitesmoke;
}
</style>
