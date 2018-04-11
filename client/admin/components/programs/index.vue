<template>
  <div>
    <h1 class="title">Programs</h1>
    <div class="actions is-clearfix">
      <button
        @click="create"
        class="btn-create button is-primary is-pulled-right">
        Create
      </button>
    </div>
    <div v-if="!hasPrograms" class="notification is-warning">
      Click on the button above to create your first program.
    </div>
    <table v-else class="table is-fullwidth is-hoverable">
      <thead>
        <th>Name</th>
        <th>Description</th>
        <th></th>
      </thead>
      <tbody>
        <tr v-for="program in programs" :key="program._cid">
          <td>{{ program.name }}</td>
          <td>{{ program.description }}</td>
          <td>
            <button @click="edit(program)" class="button is-small is-outlined">
              <span class="mdi mdi-pencil"></span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <program-modal
      :show="showModal"
      :programData="context"
      @close="showModal = false">
    </program-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import isEmpty from 'lodash/isEmpty';
import ProgramModal from './ProgramModal';

export default {
  name: 'program-list',
  data() {
    return {
      showModal: false,
      context: null
    };
  },
  computed: {
    ...mapState('programs', { programs: 'items' }),
    hasPrograms() {
      return !isEmpty(this.programs);
    }
  },
  methods: {
    ...mapActions('programs', ['fetch']),
    create() {
      this.context = null;
      this.showModal = true;
    },
    edit(program) {
      this.context = program;
      this.showModal = true;
    }
  },
  components: { ProgramModal }
};
</script>

<style lang="scss" scoped>
.actions {
  padding: 15px 0;
}
</style>
