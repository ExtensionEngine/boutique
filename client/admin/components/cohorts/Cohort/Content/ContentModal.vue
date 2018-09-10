<template>
  <modal :show="show" @close="close">
    <form @submit.prevent="importRepo" class="content-modal">
      <h2 class="title is-4">Import Content</h2>
      <v-select
        v-model="sourceId"
        :options="availableRepos"
        :searchable="true"
        :isLoading="isLoading"
        :maxHeight="150"
        name="repo"/>
      <div class="controls field is-grouped is-grouped-right">
        <button @click="close" class="control button" type="button">Cancel</button>
        <button class="control button is-primary" type="submit">Import</button>
      </div>
    </form>
  </modal>
</template>

<script>
import contentRepoApi from '@/admin/api/contentRepoApi';
import differenceBy from 'lodash/differenceBy';
import map from 'lodash/map';
import { mapActions } from 'vuex';
import Modal from '@/common/components/Modal';
import pick from 'lodash/pick';
import VSelect from '@/common/components/form/VSelect';

export default {
  name: 'content-modal',
  props: {
    show: { type: Boolean, default: false },
    cohortId: { type: Number, required: true },
    importedRepos: { type: Array, default: () => ([]) }
  },
  data() {
    return {
      isLoading: false,
      sourceId: null,
      catalog: []
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
      this.save(pick(this, ['sourceId', 'cohortId']));
      this.close();
    },
    close() {
      this.sourceId = null;
      this.$emit('close');
    }
  },
  created() {
    this.isLoading = true;
    return contentRepoApi.getCatalog().then(repos => {
      this.isLoading = false;
      this.catalog = map(repos, it => ({
        value: it.id,
        label: it.name,
        sourceId: it.id
      }));
    });
  },
  components: { Modal, VSelect }
};
</script>

<style lang="scss" scoped>
.content-modal {
  padding: 20px 10px 40px;
}

.title {
  margin-bottom: 50px;
}

.controls {
  padding-top: 60px;

  .button {
    margin-left: 6px;
  }
}
</style>
