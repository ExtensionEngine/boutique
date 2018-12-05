<template>
  <div class="mt-3">
    <v-toolbar color="#f5f5f5" flat>
      <v-spacer/>
      <content-dialog :programId="programId" :importedRepos="importedRepos"/>
    </v-toolbar>
    <div class="elevation-1 ml-2 mr-4">
      <v-layout class="px-4 py-3 table-toolbar">
        <v-flex lg3 offset-lg9>
          <v-text-field
            v-model.trim="filter"
            :disabled="importedRepos.length <= 0"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            clearable/>
        </v-flex>
      </v-layout>
      <v-data-table
        :headers="headers"
        :items="filteredRepos"
        :no-data-text="noContentMessage"
        item-key="_cid"
        hide-actions>
        <template slot="items" slot-scope="{ item }">
          <td>{{ item.name }}</td>
          <td class="no-wrap">{{ item.repoVersion | formatDate }}</td>
          <td class="no-wrap">{{ item.publishedAt | formatDate }}</td>
          <td class="no-wrap text-xs-center actions">
            <v-btn
              v-if="item.repoVersion > item.publishedAt"
              @click="save(item)"
              flat
              small>
              Sync
            </v-btn>
            <span v-else-if="item.repoVersion">Synced</span>
          </td>
          <td class="no-wrap text-xs-center">
            <v-icon @click="showConfirmationDialog(item)" small>
              mdi-delete
            </v-icon>
          </td>
        </template>
      </v-data-table>
      <confirmation-dialog
        :visible.sync="confirmation.dialog"
        :action="confirmation.action"
        :heading="confirmation.heading"
        :message="confirmation.message"
        @confirmed="fetch()"/>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ConfirmationDialog from '@/admin/components/common/ConfirmationDialog';
import ContentDialog from './ContentDialog';
import filter from 'lodash/filter';
import fuzzysearch from 'fuzzysearch';

const fuzzy = (needle, haystack) => {
  return fuzzysearch(needle.toLowerCase(), haystack.toLowerCase());
};
const headers = () => [
  { text: 'Name', value: 'name', align: 'left' },
  { text: 'Published Version', value: 'repoVersion' },
  { text: 'Imported Version', value: 'publishedAt' },
  { text: 'Sync', value: 'id', sortable: false, align: 'center' },
  { text: 'Actions', value: 'id', sortable: false, align: 'center' }
];

export default {
  name: 'imported-content',
  props: { programId: { type: Number, required: true } },
  data: () => ({
    filter: null,
    confirmation: { dialog: null }
  }),
  computed: {
    ...mapState('contentRepo', { repoStore: 'items' }),
    headers,
    importedRepos() {
      return filter(this.repoStore, it => {
        return it.id && it.programId === this.programId;
      });
    },
    filteredRepos() {
      if (!this.filter) return this.importedRepos;
      return this.importedRepos.filter(it => {
        return it.name && fuzzy(this.filter, it.name);
      });
    },
    noContentMessage() {
      return this.filter
        ? `Your search for "${this.filter}" found no results.`
        : 'Click on the button above to import content.';
    }
  },
  methods: {
    ...mapActions('contentRepo', ['fetch', 'save', 'remove']),
    showConfirmationDialog(item) {
      Object.assign(this.confirmation, {
        message: `Are you sure you want to archive "${item.name}"?`,
        heading: 'Archive content repository',
        action: () => this.remove(item),
        dialog: true
      });
    }
  },
  created() {
    const { programId } = this;
    return this.fetch({ programId, srcVersion: true });
  },
  components: { ConfirmationDialog, ContentDialog }
};
</script>

<style lang="scss" scoped>
.actions {
  width: 250px;
}
</style>
