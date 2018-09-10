<template>
  <div>
    <div class="actions is-clearfix">
      <button
        @click="showModal = true"
        class="button is-primary is-pulled-right">
        Add
      </button>
    </div>
    <div v-if="!importedRepos.length" class="notification is-warning">
      Click on the button above to import content.
    </div>
    <table v-else class="table is-fullwidth is-hoverable">
      <thead>
        <th>Name</th>
        <th>Published Version</th>
        <th>Imported Version</th>
        <th>Sync</th>
      </thead>
      <tbody>
        <tr v-for="it in importedRepos" :key="it._cid">
          <td>{{ it.name }}</td>
          <td>{{ it.repoVersion | formatDate }}</td>
          <td>{{ it.publishedAt | formatDate }}</td>
          <td>
            <button
              v-if="it.repoVersion > it.publishedAt"
              @click="save(it)"
              type="button"
              class="control button">
              Sync
            </button>
            <span v-else-if="it.repoVersion">Synced</span>
          </td>
        </tr>
      </tbody>
    </table>
    <content-modal
      :show="showModal"
      :cohortId="cohortId"
      :importedRepos="importedRepos"
      @close="showModal = false"/>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ContentModal from './ContentModal';
import filter from 'lodash/filter';

export default {
  name: 'imported-content',
  props: { cohortId: { type: Number, required: true } },
  data() {
    return { showModal: false };
  },
  computed: {
    ...mapState('contentRepo', { repoStore: 'items' }),
    importedRepos() {
      const { cohortId } = this;
      return filter(this.repoStore, { cohortId });
    }
  },
  methods: mapActions('contentRepo', ['fetch', 'save']),
  mounted() {
    const { cohortId } = this;
    return this.fetch({ cohortId, srcVersion: true });
  },
  components: { ContentModal }
};
</script>

<style lang="scss" scoped>
.notification {
  margin-top: 10px;
}
</style>
