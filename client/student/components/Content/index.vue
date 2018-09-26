<template>
  <div class="content container is-fluid">
    <div class="columns is-multiline">
      <card
        v-for="it in getContent"
        :key="it._cid"
        :content="it"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Card from './Card';

export default {
  name: 'content-list',
  computed: mapGetters('content', ['getContent']),
  methods: mapActions('content', ['fetch']),
  created() {
    this.fetch({ includeStructure: true });
  },
  components: { Card }
};
</script>

<style lang="scss" scoped>
.content {
  padding: 30px 100px 100px;

  @media (min-width: 1700px) {
    padding: 30px 300px 100px;
  }
}
</style>
