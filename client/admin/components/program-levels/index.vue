<template>
  <div>
    <h1 class="title">Program Levels</h1>
    <div class="actions is-clearfix">
      <button
        v-if="hasPrograms"
        @click="create"
        class="btn-create button is-primary is-pulled-right">
        Create
      </button>
    </div>
    <div v-if="!hasPrograms" class="notification is-danger">
      Please create at least one program first!
    </div>
    <div v-else-if="!hasProgramLevels" class="notification">
      Click on the button above to create your first program level.
    </div>
    <div v-else>
      <div v-for="it in programLevels" :key="it._cid" class="card">
        <div class="card-content">
          <router-link
            :to="{ name: 'enrollments', params: { programLevelId: it.id } }"
            class="is-size-3">
            {{ it.name }}
          </router-link>
          <p class="subtitle is-size-6">{{ getProgramName(it.programId) }}</p>
        </div>
        <footer class="card-footer">
          <a @click="edit(it)" href="#" class="card-footer-item">
            Edit
          </a>
        </footer>
      </div>
    </div>
    <program-level-modal
      :show="showModal"
      :programLevelData="context"
      @close="showModal = false">
    </program-level-modal>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import ProgramLevelModal from './ProgramLevelModal';

export default {
  name: 'program-level-list',
  data() {
    return {
      showModal: false,
      context: null
    };
  },
  computed: {
    ...mapState('programs', { programs: 'items' }),
    ...mapState('programLevels', { programLevels: 'items' }),
    hasPrograms() {
      return !isEmpty(this.programs);
    },
    hasProgramLevels() {
      return !isEmpty(this.programLevels);
    }
  },
  methods: {
    ...mapActions('programLevels', ['fetch']),
    getProgramName(id) {
      return get(find(this.programs, { id }), 'name', '');
    },
    create() {
      this.context = null;
      this.showModal = true;
    },
    edit(programLevel) {
      this.context = programLevel;
      this.showModal = true;
    }
  },
  mounted() {
    this.fetch();
  },
  components: { ProgramLevelModal }
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
