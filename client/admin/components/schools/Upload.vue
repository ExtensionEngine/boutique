<template>
  <div class="school-upload">
    <b v-if="isUploading">
      <span class="icon mdi mdi-loading mdi-spin"/>
      Uploading, please wait...
    </b>
    <form
      v-else
      @submit.prevent="prepareUpload"
      method="POST"
      enctype="multipart/form-data"
      ref="form">
      <div class="file has-name is-fullwidth">
        <label class="file-label">
          <input
            @change="updateFileName"
            class="file-input"
            name="csv"
            type="file">
          <span class="file-cta">
            <span class="file-icon mdi mdi-upload"/>
            <span class="file-label">{{ label }}</span>
          </span>
          <span class="file-name">
            {{ fileName || placeholder }}
          </span>
          <input
            :disabled="!fileName"
            class="button is-primary"
            type="submit"
            value="Upload">
        </label>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'school-upload',
  props: {
    label: {
      type: String,
      default: 'Upload NCES School Universe List'
    },
    placeholder: {
      type: String,
      default: 'Please select a file to upload'
    }
  },
  data() {
    return {
      fileName: ''
    };
  },
  computed: mapState('schools', ['isUploading']),
  methods: {
    ...mapActions('schools', ['reset', 'upload']),
    prepareUpload() {
      const { form } = this.$refs;
      const data = new window.FormData(form);

      if (!data.has('csv')) return;
      this.upload({ path: 'import', data }).then(this.reset);
    },
    updateFileName({ target: { files } }) {
      this.fileName = files[0].name;
    }
  }
};
</script>

<style lang="scss">
.school-upload {
  margin: 2rem auto;

  input[type=submit] {
    width: 8rem;
    margin-left: 1rem;
  }
}
</style>
