<template>
  <modal :show="show" @close="close">
    <form @submit.prevent="add" class="content-modal">
      <h2 class="title is-4">Add Content</h2>
      <v-select
        v-model="sourceId"
        :options="availableCourses"
        :searchable="true"
        :isLoading="isLoading"
        :maxHeight="150"
        name="catalog">
      </v-select>
      <div class="controls field is-grouped is-grouped-right">
        <button @click="close" class="control button" type="button">Cancel</button>
        <button class="control button is-primary" type="submit">Add</button>
      </div>
    </form>
  </modal>
</template>

<script>
import coursesApi from '@/admin/api/coursesApi';
import differenceBy from 'lodash/differenceBy';
import map from 'lodash/map';
import { mapActions } from 'vuex';
import Modal from '@/common/components/Modal';
import pick from 'lodash/pick';
import VSelect from '@/common/components/form/VSelect';

export default {
  name: 'content-modal',
  props: {
    programLevelId: { type: Number, required: true },
    show: { type: Boolean, default: false },
    importedCourses: { type: Array, default: () => ([]) }
  },
  data() {
    return {
      isLoading: false,
      sourceId: null,
      catalog: []
    };
  },
  computed: {
    availableCourses() {
      return differenceBy(this.catalog, this.importedCourses, 'sourceId');
    }
  },
  methods: {
    ...mapActions('courses', ['save']),
    add() {
      this.save(pick(this, ['sourceId', 'programLevelId']));
      this.close();
    },
    close() {
      this.sourceId = null;
      this.$emit('close');
    }
  },
  created() {
    this.isLoading = true;
    return coursesApi.getCatalog().then(({ data }) => {
      this.isLoading = false;
      this.catalog = map(data, it => ({
        value: it.id, label: `${it.name}`, sourceId: it.id
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
