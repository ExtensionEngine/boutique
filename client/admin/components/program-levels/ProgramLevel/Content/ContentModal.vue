<template>
  <modal :show="show" @close="close">
    <div class="content-modal">
      <h2 class="title is-4">Add Content</h2>
      <v-select
        v-model="courseId"
        :options="catalogList"
        :searchable="true"
        :isLoading="isLoading"
        :maxHeight="150"
        @search-change="search"
        name="catalog">
      </v-select>
      <div class="controls field is-grouped is-grouped-right">
        <button @click="close" class="control button">Cancel</button>
        <button @click="add" class="control button is-primary">Add</button>
      </div>
    </div>
  </modal>
</template>

<script>
import map from 'lodash/map';
import { mapActions } from 'vuex';
import Modal from '@/common/components/Modal';
import pick from 'lodash/pick';
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
      courseId: null,
      catalogList: []
    };
  },
  methods: {
    ...mapActions('courses', ['save']),
    add() {
      this.save(pick(this, ['courseId', 'programLevelId']));
      this.close();
    },
    close() {
      this.name = null;
      this.$emit('close');
    },
    search() {
      request.get('/courses/catalog').then(({ data: { data } }) => {
        this.isLoading = false;
        this.catalogList = map(data, it => ({
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
