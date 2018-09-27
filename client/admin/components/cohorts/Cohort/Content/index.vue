<template>
  <div class="mt-3">
    <v-toolbar color="f5f5f5" flat>
      <v-spacer/>
      <content-modal :cohortId="cohortId" :importedRepos="importedRepos"/>
    </v-toolbar>
    <v-alert v-if="!importedRepos.length" :value="true" color="#aaa">
      Click on the button above to import content.
    </v-alert>
    <div v-else class="elevation-1 mx-4">
      <v-data-table :headers="headers" :items="importedRepos" hide-actions>
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.repoVersion | formatDate }}</td>
          <td>{{ props.item.publishedAt | formatDate }}</td>
          <td>
            <v-btn
              v-if="props.item.repoVersion > props.item.publishedAt"
              @click="save(props.item)">
              Sync
            </v-btn>
            <span v-else-if="props.item.repoVersion">Synced</span>
          </td>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ContentModal from './ContentModal';
import filter from 'lodash/filter';

export default {
  name: 'imported-content',
  props: { cohortId: { type: Number, required: true } },
  computed: {
    ...mapState('contentRepo', { repoStore: 'items' }),
    headers: () => ([
      { text: 'Name', value: 'name', align: 'left' },
      { text: 'Published Version', value: 'repoVersion' },
      { text: 'Imported Version', value: 'publishedAt' },
      { text: 'Sync', value: 'publishedAt' }
    ]),
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
