<template>
  <v-dialog v-model="visible" v-hotkey="{ esc: close }" width="700">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" color="success" outlined>Import Content</v-btn>
    </template>
    <v-form @submit.prevent="importRepo">
      <v-card class="pa-3">
        <v-card-title class="headline">Import Content</v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="sourceId"
            :items="availableRepos"
            :loading="isLoading"
            item-value="sourceId"
            no-data-text="No available repositories for import"
            prepend-icon="mdi-magnify"
            label="Repository"
            placeholder="Start typing to Search"
            hide-selected />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="close" :disabled="isImporting">Cancel</v-btn>
          <v-btn
            :disabled="!sourceId"
            :loading="isImporting"
            type="submit"
            color="success"
            outlined>
            Import
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import api from '@/admin/api/contentRepo';
import differenceBy from 'lodash/differenceBy';
import map from 'lodash/map';
import { mapActions } from 'vuex';
import pick from 'lodash/pick';

export default {
  name: 'content-import-dialog',
  props: {
    programId: { type: Number, required: true },
    importedRepos: { type: Array, default: () => [] }
  },
  data: () => ({
    visible: false,
    sourceId: null,
    catalog: [],
    isImporting: false,
    isLoading: false
  }),
  computed: {
    availableRepos: vm => differenceBy(vm.catalog, vm.importedRepos, 'sourceId')
  },
  methods: {
    ...mapActions('contentRepo', ['save']),
    importRepo() {
      this.isImporting = true;
      this.save(pick(this, ['sourceId', 'programId']))
        .finally(() => {
          this.isImporting = false;
          this.close();
        });
    },
    processCatalog(repos) {
      this.catalog = map(repos, it => ({ text: it.name, sourceId: it.id }));
    },
    close() {
      this.visible = false;
      this.sourceId = null;
      this.catalog = [];
    }
  },
  watch: {
    visible(val) {
      if (!val) return;
      this.isLoading = true;
      return api.getCatalog()
        .then(this.processCatalog)
        .finally(() => (this.isLoading = false));
    }
  }
};
</script>
