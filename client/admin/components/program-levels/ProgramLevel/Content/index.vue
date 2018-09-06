<template>
  <div>
    <div class="actions is-clearfix">
      <button
        @click="showModal = true"
        class="button is-primary is-pulled-right">
        Add
      </button>
    </div>
    <div v-if="!importedContent.length" class="notification is-warning">
      Click on the button above to add your first content.
    </div>
    <table v-else class="table is-fullwidth is-hoverable">
      <thead>
        <th>Name</th>
        <th>Repo Version</th>
        <th>Synced Version</th>
        <th>Sync</th>
      </thead>
      <tbody>
        <tr v-for="it in importedContent" :key="it._cid">
          <td>{{ it.name }}</td>
          <td>{{ it.repoVersion | formatDate }}</td>
          <td>{{ it.publishedAt | formatDate }}</td>
          <td>
            <button
              v-if="it.repoVersion > it.publishedAt"
              @click="importContentRepo(it)"
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
      :programLevelId="programLevelId"
      :importedContent="importedContent"
      @close="showModal = false">
    </content-modal>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ContentModal from './ContentModal';
import filter from 'lodash/filter';

export default {
  name: 'imported-content',
  data() {
    return { showModal: false };
  },
  computed: {
    ...mapState('contentRepo', { contentRepoStore: 'items' }),
    importedContent() {
      const { programLevelId } = this;
      return filter(this.contentRepoStore, { programLevelId });
    },
    programLevelId() {
      return parseInt(this.$route.params.programLevelId, 10);
    }
  },
  methods: mapActions('contentRepo', {
    fetchImportedContent: 'fetch', importContentRepo: 'save'
  }),
  created() {
    const { programLevelId } = this;
    const srcVersion = true;
    return this.fetchImportedContent({ programLevelId, srcVersion });
  },
  components: { ContentModal }
};
</script>

<style lang="scss" scoped>
.notification {
  margin-top: 10px;
}
</style>
