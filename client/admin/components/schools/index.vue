<template>
  <div>
    <h1 class="title">Schools</h1>
    <input type="file" @change="prepareUpload" name="csv"/>
    <table class="table is-fullwidth is-hoverable">
      <thead>
        <th>Name</th>
        <th>State</th>
        <th>Level</th>
        <th>Type</th>
      </thead>
      <tbody>
        <tr v-for="school in schools" :key="school._cid">
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
import { mapState, mapActions } from 'vuex';

export default {
  name: 'school-list',
  computed: mapState('schools', { schools: 'items' }),
  methods: {
    ...mapActions('schools', ['fetch', 'upload']),
    prepareUpload({ target: { files } }) {
      if (files.length === 0) return;
      const data = new FormData(); // eslint-disable-line
      data.append('csv', files[0], files[0].name);
      this.upload({ path: 'import', data });
    }
  },
  mounted() {
    this.fetch();
  }
};
</script>
