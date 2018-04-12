<template>
  <div>
    <h1 class="title">Schools</h1>
    <upload/>
    <div class="field">
      <multiselect
        :options="districts"
        :close-on-select="true"
        :clear-on-select="false"
        placeholder="Filter by District"
        label="name"
        track-by="name"
        @open="fetchOptions"
        @select="filterSchools">
      </multiselect>
    </div>

    <table class="table is-fullwidth is-hoverable">
      <thead>
        <th>District</th>
        <th>Name</th>
        <th>State</th>
        <th>Level</th>
        <th>Type</th>
      </thead>
      <tbody>
        <tr v-for="school in schools" :key="school._cid">
          <td>{{ school.district.name }}</td>
          <td>{{ school.name }}</td>
          <td>{{ school.state }}</td>
          <td>{{ school.ncesSchoolLevel }}</td>
          <td>{{ school.ncesType }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import Multiselect from 'vue-multiselect';
import Upload from './Upload';

export default {
  name: 'school-list',
  computed: {
    ...mapState('schools', { schools: 'items' }),
    ...mapGetters('districts', { districts: 'array' })
  },
  methods: {
    ...mapActions('schools', { fetchSchools: 'fetch', resetSchools: 'reset' }),
    ...mapActions('districts', { fetchDistricts: 'fetch' }),
    filterSchools(selectedDistrict) {
      this.resetSchools({ districtId: selectedDistrict.id });
    },
    fetchOptions() {
      if (this.districts.length) return;
      this.fetchDistricts();
    }
  },
  mounted() {
    this.fetchSchools();
  },
  components: {
    Multiselect,
    Upload
  }
};
</script>

<style lang="scss">
@import '~vue-multiselect/dist/vue-multiselect.min';
</style>
