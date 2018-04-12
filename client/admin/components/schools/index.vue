<template>
  <div>
    <h1 class="title">Schools</h1>
    <b v-if="isUploading"> (TODO: add icon) Uploading, please wait...</b>
    <form v-else @submit.prevent="prepareUpload" method="POST" enctype="multipart/form-data">
      <div class="file has-name is-fullwidth">
        <label class="file-label">
          <input ref="csv" @change="updateFileName" class="file-input" type="file" name="csv"/>
          <span class="file-cta">
            <span class="file-icon">
              <i class="fas fa-upload"></i>
            </span>
            <span class="file-label">
              NCES School Universe File
            </span>
          </span>
          <span class="file-name">
            {{ fileName || 'Please select a file to upload' }}
          </span>
          <input type="submit" value="Upload" class="button is-primary" disabled="!fileName"/>
        </label>
      </div>
    </form>
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
  data() {
    return {
      fileName: ''
    };
  },
  computed: mapState('schools',
    {
      isUploading: 'isUploading',
      schools: 'items'
    }
  ),
  methods: {
    ...mapActions('schools', ['fetch', 'upload']),
    prepareUpload() {
      const { files } = this.$refs.csv;
      if (files.length === 0) return;
      const data = new FormData(); // eslint-disable-line
      data.append('csv', files[0], files[0].name);
      this.upload({ path: 'import', data });
    },
    updateFileName({ target: { files } }) {
      this.fileName = files[0].name;
    }
  },
  mounted() {
    this.fetch();
  }
};
</script>

<style lang="scss" scoped>
input[type=submit] {
  width: 8rem;
  margin-left: 1rem;
}
</style>
