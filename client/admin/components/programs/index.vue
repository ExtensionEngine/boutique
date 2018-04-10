<template>
  <div>
    <h1 class="title">Programs</h1>
    <button
      @click="create"
      class="btn-create button is-primary is-pulled-right">
      Create
    </button>
    <table class="table is-fullwidth is-hoverable">
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
import ProgramModal from './ProgramModal';

export default {
  name: 'program-list',
  data() {
    return {
      showModal: false,
      context: null
    };
  },
  computed: mapState('programs', { programs: 'items' }),
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
  mounted() {
    this.fetch();
  },
  components: { ProgramModal }
};
</script>
