<template>
  <div class="mt-3">
    <v-toolbar color="#f5f5f5" flat>
      <v-spacer/>
      <content-dialog :programId="programId" :importedRepos="importedRepos"/>
    </v-toolbar>
    <v-alert
      :value="!isLoading && !importedRepos.length"
      color="#aaa"
      class="mr-4">
      Click on the button above to import content.
    </v-alert>
    <div v-if="importedRepos.length" class="elevation-1 ml-2 mr-4">
      <v-data-table
        :headers="headers"
        :items="importedRepos"
        item-key="_cid"
        hide-actions>
        <template slot="items" slot-scope="{ item }">
          <td>{{ item.name }}</td>
          <td>{{ item.repoVersion | formatDate }}</td>
          <td>{{ item.publishedAt | formatDate }}</td>
          <td>
            <v-btn
              v-if="item.repoVersion > item.publishedAt"
              @click="save(item)">
              Sync
            </v-btn>
            <span v-else-if="item.repoVersion">Synced</span>
          </td>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ContentDialog from './ContentDialog';
import filter from 'lodash/filter';

export default {
  name: 'imported-content',
  props: { programId: { type: Number, required: true } },
  data() {
    return { isLoading: true };
  },
  computed: {
    ...mapState('contentRepo', { repoStore: 'items' }),
    headers: () => ([
      { text: 'Name', value: 'name', align: 'left' },
      { text: 'Published Version', value: 'repoVersion' },
      { text: 'Imported Version', value: 'publishedAt' },
      { text: 'Sync', value: 'id', sortable: false }
    ]),
    importedRepos() {
      const { programId } = this;
      return filter(this.repoStore, { programId });
    }
  },
  methods: mapActions('contentRepo', ['fetch', 'save']),
  mounted() {
    const { programId } = this;
    return this.fetch({ programId, srcVersion: true })
      .then(() => (this.isLoading = false));
  },
  components: { ContentDialog }
};
</script>
