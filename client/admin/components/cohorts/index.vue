<template>
  <div>
    <h1 class="title">Cohorts</h1>
    <div class="actions is-clearfix">
      <button
        @click="create"
        class="btn-create button is-primary is-pulled-right">
        Create cohort
      </button>
    </div>
    <div v-if="!hasCohorts" class="notification">
      Click on the button above to create first cohort.
    </div>
    <div v-else>
      <div v-for="it in cohorts" :key="it._cid" class="card">
        <div class="card-content">
          <router-link
            :to="{ name: 'enrollments', params: { cohortId: it.id } }"
            class="is-size-3">
            {{ it.name }}
          </router-link>
        </div>
        <footer class="card-footer">
          <a @click="edit(it)" href="#" class="card-footer-item">Edit</a>
        </footer>
      </div>
    </div>
    <cohort-modal
      :show="showModal"
      :cohortData="context"
      @close="showModal = false"/>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import CohortModal from './CohortModal';
import isEmpty from 'lodash/isEmpty';

export default {
  name: 'cohort-list',
  data() {
    return {
      showModal: false,
      context: null
    };
  },
  computed: {
    ...mapState('cohorts', { cohorts: 'items' }),
    hasCohorts() {
      return !isEmpty(this.cohorts);
    }
  },
  methods: {
    ...mapActions('cohorts', ['fetch']),
    create() {
      this.context = null;
      this.showModal = true;
    },
    edit(cohort) {
      this.context = cohort;
      this.showModal = true;
    }
  },
  created() {
    this.fetch();
  },
  components: { CohortModal }
};
</script>

<style lang="scss" scoped>
.actions {
  padding: 10px 0;
}

.card {
  margin: 40px 0;
}
</style>
