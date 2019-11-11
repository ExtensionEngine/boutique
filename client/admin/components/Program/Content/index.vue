<template>
  <div class="mt-3">
    <v-toolbar color="#f5f5f5" flat>
      <v-spacer />
      <content-dialog :program-id="programId" :imported-repos="importedRepos" />
    </v-toolbar>
    <div class="elevation-1 ml-2 mr-4">
      <v-layout column align-end class="px-4 table-toolbar">
        <v-flex lg4>
          <v-text-field
            v-model.trim="filter"
            :disabled="importedRepos.length <= 0"
            append-icon="mdi-magnify"
            label="Search"
            hide-details
            single-line
            clearable />
        </v-flex>
        <v-flex lg4>
          <v-checkbox
            v-model="showArchived"
            label="Show archived"
            class="my-2 archived-checkbox"
            hide-details />
        </v-flex>
      </v-layout>
      <v-data-table
        :headers="headers"
        :items="filteredRepos"
        :no-data-text="noContentMessage"
        item-key="_cid"
        hide-actions>
        <template slot="items" slot-scope="{ item }">
          <tr
            v-show="!item.deletedAt || showArchived"
            :key="item.sourceId"
            :class="{ 'grey lighten-2': item.deletedAt }">
            <td>{{ item.name }}</td>
            <td class="text-no-wrap">{{ item.repoVersion | formatDate }}</td>
            <td class="text-no-wrap">{{ item.publishedAt | formatDate }}</td>
            <td class="text-no-wrap text-xs-center actions">
              <v-btn
                v-if="item.repoVersion > item.publishedAt"
                @click="save(item)"
                flat
                small>
                Sync
              </v-btn>
              <span v-else-if="item.repoVersion">Synced</span>
            </td>
            <td>
              <v-btn
                v-if="!item.deletedAt"
                @click="showConfirmationDialog(item)"
                icon
                flat>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-btn
                v-else
                @click="showRestoreDialog(item)"
                icon
                flat>
                <v-icon>mdi-restore</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
      <confirmation-dialog
        @update:visible="confirmation = null"
        @confirmed="fetchProgramRepos()"
        v-bind="confirmation" />
      <multiple-choice-dialog
        @closed="restoreOptions = null"
        @completed="fetchProgramRepos()"
        v-bind="restoreOptions" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import api from '@/admin/api/contentRepo';
import ConfirmationDialog from '@/admin/components/common/ConfirmationDialog';
import ContentDialog from './ContentDialog';
import filter from 'lodash/filter';
import fuzzysearch from 'fuzzysearch';
import MultipleChoiceDialog from '@/admin/components/common/MultipleChoiceDialog';

const fuzzy = (input, content) => {
  return fuzzysearch(input.toLowerCase(), content.toLowerCase());
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
    confirmation: null,
    showArchived: true,
    restoreOptions: null
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
    ...mapActions('contentRepo', ['fetch', 'save']),
    fetchProgramRepos() {
      const { programId } = this;
      return this.fetch({ programId, srcVersion: true, archived: true });
    },
    showConfirmationDialog(item) {
      this.confirmation = {
        message: `Are you sure you want to archive "${item.name}"?`,
        heading: 'Archive content repository',
        action: () => api.archive(item),
        visible: true
      };
    },
    showRestoreDialog(item) {
      this.restoreOptions = {
        heading: `${item.name}`,
        message: 'Would you like to restore this course or import the latest version?',
        warning: 'Importing new repository overwrites the existing (archived) copy.',
        actions: [
          { label: 'restore', callback: () => api.restore(item) },
          { label: 'import', callback: () => this.save(item) }
        ],
        visible: true
      };
    }
  },
  created() {
    this.fetchProgramRepos();
  },
  components: { ConfirmationDialog, ContentDialog, MultipleChoiceDialog }
};
</script>

<style lang="scss" scoped>
.actions {
  width: 250px;
}

.archived-checkbox /deep/ .v-input__slot {
  flex-direction: row-reverse;

  .v-input--selection-controls__input {
    justify-content: center;
    margin-right: 0;
  }

  .v-icon {
    font-size: 18px;
  }

  label {
    font-size: 14px;
  }
}
</style>
