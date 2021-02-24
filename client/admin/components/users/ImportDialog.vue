<template>
  <admin-dialog v-model="visible" width="600" header-icon="mdi-cloud-upload">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" color="primary" text>
        <v-icon dense class="mr-1">mdi-cloud-upload</v-icon>Import users
      </v-btn>
    </template>
    <template v-slot:header>Import Users</template>
    <template v-slot:body>
      <validation-observer
        v-if="visible"
        ref="form"
        v-slot="{ invalid }"
        @submit.prevent="$refs.form.handleSubmit(submit)"
        tag="form"
        novalidate>
        <validation-provider v-slot="{ errors }" name="File" slim>
          <div :class="{ 'drop-file': isDragged }" class="select-file">
            <v-btn @click="launchFilePicker" color="info">
              <v-icon class="pr-2">mdi-upload</v-icon>
              Upload .xslx or .csv file
            </v-btn>
            <div class="my-3">Or drag and drop file here</div>
            <v-chip
              v-if="file"
              @input="removeFile"
              @click:close="removeFile"
              close>
              {{ file.name }}
            </v-chip>
            <div class="errors-list">{{ errors[0] }}</div>
            <label for="userImportInput">
              <input
                v-show="isDragged"
                ref="dropZone"
                @change="onFileSelected"
                @dragend="hideDropZone"
                @dragover="showDropZone"
                @dragenter="showDropZone"
                @dragleave="hideDropZone"
                @drop="hideDropZone"
                :accept="acceptedFiles"
                name="file"
                type="file"
                class="drop-zone">
            </label>
          </div>
        </validation-provider>
        <div class="d-flex align-center mb-2 mt-3">
          <v-btn @click="downloadTemplateFile" text color="blue-grey">
            Download Template
          </v-btn>
          <v-spacer />
          <v-fade-transition>
            <v-btn
              v-show="serverErrorsReport"
              @click="downloadErrorsFile"
              color="error">
              <v-icon class="pr-2">mdi-cloud-download</v-icon>Errors
            </v-btn>
          </v-fade-transition>
          <v-btn @click="close" text>Cancel</v-btn>
          <v-btn :disabled="invalid" :loading="importing" type="submit" text>
            Import
          </v-btn>
        </div>
      </validation-observer>
    </template>
  </admin-dialog>
</template>

<script>
import AdminDialog from '@/admin/components/common/Dialog';
import api from '@/admin/api/user';
import saveAs from 'save-as';
import { validate } from 'vee-validate';

const inputFormats = {
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'text/csv': 'csv'
};

export default {
  name: 'import-dialog',
  data: () => ({
    visible: false,
    importing: false,
    file: null,
    form: null,
    isDragged: false,
    serverErrorsReport: null
  }),
  computed: {
    inputValidation: () => ({ required: true, mimes: Object.keys(inputFormats) }),
    acceptedFiles: () => Object.keys(inputFormats)
  },
  methods: {
    showDropZone() {
      if (this.visible) {
        this.isDragged = true;
      }
    },
    hideDropZone() {
      this.isDragged = false;
    },
    removeFile() {
      this.file = null;
      this.form = null;
      this.$refs.dropZone.value = null;
      this.isDragged = false;
      this.resetErrors();
    },
    launchFilePicker() {
      this.$refs.dropZone.click();
    },
    async onFileSelected(e) {
      this.form = new FormData();
      this.resetErrors();
      const [file] = e.target.files;
      if (!file) return (this.file = null);
      this.file = file;
      const { valid, errors } = await validate(file, this.inputValidation, { name: 'File' });
      if (valid) return (this.form.append('file', file, file.name));
      this.$refs.form.setErrors({ File: errors });
    },
    close() {
      if (this.importing) return;
      this.file = null;
      this.isDragged = false;
      this.$refs.dropZone.value = null;
      this.resetErrors();
      this.visible = false;
    },
    submit() {
      this.importing = true;
      const { file } = this;
      this.form = new FormData();
      this.form.append('file', file, file.name);
      return api.bulkImport(this.form).then(({ data, count }) => {
        this.importing = false;
        if (count) this.$emit('imported');
        if (!data.size) return this.close();
        this.$refs.form.setErrors({ File: [`${count} users were successfully imported.`] });
        this.serverErrorsReport = data;
      }).catch(err => {
        this.importing = false;
        this.$refs.form.setErrors({ File: ['Importing users failed.'] });
        return Promise.reject(err);
      });
    },
    resetErrors() {
      this.$refs.form.reset();
      this.serverErrorsReport = null;
    },
    downloadErrorsFile() {
      const extension = inputFormats[this.serverErrorsReport.type];
      saveAs(this.serverErrorsReport, `Errors.${extension}`);
    },
    async downloadTemplateFile() {
      const { data } = await api.getImportTemplate();
      saveAs(data, `Template.${inputFormats[data.type]}`);
    }
  },
  mounted() {
    window.addEventListener('dragenter', this.showDropZone);
  },
  beforeDestroy() {
    window.removeEventListener('dragenter', this.showDropZone);
  },
  components: { AdminDialog }
};
</script>

<style lang="scss" scoped>
.select-file {
  padding: 3.125rem 0.625rem;
  text-align: center;
  color: gray;
  background-color: #f5f5f5;
  border-radius: 5px;
}

.drop-file {
  background-color: #eee;
  outline: 2px dashed #aaa;
  outline-offset: -0.625rem;
}

.errors-list {
  color: red;
}

.drop-zone {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
}
</style>
