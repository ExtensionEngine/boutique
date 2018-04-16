<template>
  <div>
    <h1 class="title">Schools</h1>
    <upload/>
    <filter-autocomplete/>
    <modal
      :show="showModal"
      :schoolData="context"
      @close="showModal = false"/>
    <table class="table is-fullwidth is-hoverable">
      <thead>
        <th>District</th>
        <th>Name</th>
        <th>State</th>
        <th>Level</th>
        <th>Status</th>
        <th>Type</th>
        <th>Actions</th>
      </thead>
      <tbody>
        <tr
          v-for="school in schools"
          :class="{ 'is-selected': (school.id === context.id) }"
          :key="school._cid">
          <td>{{ school.district && school.district.name }}</td>
          <td>{{ school.name }}</td>
          <td>{{ school.state }}</td>
          <td>{{ school.level }}</td>
          <td>{{ school.status }}</td>
          <td>{{ school.type }}</td>
          <td>
            <button
              @click="() => edit(school)"
              class="button"
              title="Edit this school info">
              <span class="icon">
                <i class="mdi mdi-pencil"></i>
              </span>
            </button>

            <button
              @click="() => remove(school)"
              class="button is-danger"
              title="Delete this school">
              <span class="icon">
                <i class="mdi mdi-delete"></i>
              </span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import FilterAutocomplete from './FilterAutocomplete';
import Modal from './Modal';
import Upload from './Upload';

export default {
  name: 'school-list',
  data() {
    return {
      context: {},
      showModal: false
    };
  },
  computed: mapState('schools', { schools: 'items' }),
  methods: {
    ...mapActions('schools', ['fetch', 'remove']),
    edit(context) {
      this.context = context;
      this.showModal = true;
    }
  },
  mounted() {
    this.fetch();
  },
  components: {
    FilterAutocomplete,
    Modal,
    Upload
  }
};
</script>
