<template>
  <v-dialog v-hotkey="{ esc: close }" v-model="visible" width="700">
    <v-btn slot="activator" color="success" outline>Import Content</v-btn>
    <v-form @submit.prevent="importRepo">
      <v-card class="pa-3">
        <v-card-title class="headline">Import Content</v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="sourceId"
            :items="availableRepos"
            :loading="isLoading"
            @focus="focusTrap.pause()"
            @blur="focusTrap.unpause()"
            item-value="sourceId"
            no-data-text="No available repositories for import"
            prepend-icon="mdi-magnify"
            label="Repository"
            placeholder="Start typing to Search"
            hide-selected/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="close">Cancel</v-btn>
          <v-btn :disabled="isLoading || !sourceId" color="success" outline type="submit">Import</v-btn>
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
import { withFocusTrap } from '@/common/focustrap';

const el = vm => vm.$children[0].$refs.dialog;

export default {
  name: 'content-import-dialog',
  mixins: [withFocusTrap({ el })],
  props: {
    programId: { type: Number, required: true },
    importedRepos: { type: Array, default: () => ([]) }
  },
  data() {
    return {
      visible: false,
      sourceId: null,
      catalog: [],
      isLoading: false
    };
  },
  computed: {
    availableRepos() {
      return differenceBy(this.catalog, this.importedRepos, 'sourceId');
    }
  },
  methods: {
    ...mapActions('contentRepo', ['save']),
    importRepo() {
      this.save(pick(this, ['sourceId', 'programId']));
      this.close();
    },
    close() {
      this.visible = false;
      this.sourceId = null;
      this.catalog = [];
    }
  },
  watch: {
    visible(val) {
      this.$nextTick(() => this.focusTrap.toggle(val));
      if (!val) return;
      this.isLoading = true;
      return api.getCatalog()
        .then(repos => {
          this.catalog = map(repos, it => ({ text: it.name, sourceId: it.id }));
        })
        .finally(() => (this.isLoading = false));
    }
  }
};
</script>
