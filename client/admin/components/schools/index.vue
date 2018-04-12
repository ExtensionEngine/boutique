<template>
  <div>
    <h1 class="title">Schools</h1>
    <upload/>
    <filter-autocomplete/>
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
        <tr v-for="school in schools" :key="school._cid">
          <td>{{ school.district && school.district.name }}</td>
          <td>{{ school.name }}</td>
          <td>{{ school.state }}</td>
          <td>{{ school.ncesSchoolLevel }}</td>
          <td>{{ school.ncesStatus }}</td>
          <td>{{ school.ncesType }}</td>
          <td>
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
import Upload from './Upload';

export default {
  name: 'school-list',
  computed: mapState('schools', { schools: 'items' }),
  methods: mapActions('schools', ['fetch', 'remove']),
  mounted() {
    this.fetch();
  },
  components: {
    FilterAutocomplete,
    Upload
  }
};
</script>
