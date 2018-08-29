<template>
  <modal :show="show" @close="close">
    <div class="content-modal">
      <h2 class="title is-4">Add Content</h2>
      <v-select
        v-model="catalogItemId"
        :options="catalog"
        :searchable="true"
        :isLoading="isLoading"
        :maxHeight="150"
        @search-change="search"
        name="catalog">
      </v-select>
      <div class="controls field is-grouped is-grouped-right">
        <button @click="close" class="control button">Cancel</button>
        <button class="control button is-primary">Add</button>
      </div>
    </div>
  </modal>
</template>

<script>
import map from 'lodash/map';
import Modal from '@/common/components/Modal';
import request from '@/common/api/request';
import VSelect from '@/common/components/form/VSelect';

export default {
  name: 'content-modal',
  props: {
    programLevelId: { type: Number, required: true },
    show: { type: Boolean, default: false }
  },
  data() {
    return {
      isLoading: false,
      catalogItemId: null,
      catalog: []
    };
  },
  methods: {
    close() {
      this.catalogItemId = null;
      this.$emit('close');
    },
    search() {
      request.get('/course/catalog').then(({ data: { data } }) => {
        this.isLoading = false;
        this.catalog = map(data, it => ({
          value: it.id, label: `${it.name}`
        }));
      });
    }
  },
  created() {
    this.search();
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
