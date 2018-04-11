<template>
  <div>
    <h1 class="title">Program Levels</h1>
    <button
      @click="create"
      class="btn-create button is-primary is-pulled-right">
      Create
    </button>
    <table class="table is-fullwidth is-hoverable">
      <thead>
        <th>Name</th>
        <th>Program</th>
        <th></th>
      </thead>
      <tbody>
        <tr v-for="it in programLevels" :key="it._cid">
          <td>{{ it.name }}</td>
          <td>{{ getProgramName(it.programId) }}</td>
          <td>
            <button @click="edit(it)" class="button is-small is-outlined">
              <span class="mdi mdi-pencil"></span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <program-level-modal
      :show="showModal"
      :programLevelData="context"
      @close="showModal = false">
    </program-level-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import find from 'lodash/find';
import get from 'lodash/get';
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
    ...mapState('programLevels', { programLevels: 'items' })
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
