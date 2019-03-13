<template>
  <v-dialog
    ref="dialog"
    v-model="showDialog"
    v-hotkey="{ esc: close }"
    persistent
    no-click-animation
    width="700">
    <v-btn slot="activator" color="blue-grey" outline>
      <v-icon>mdi-cloud-upload</v-icon>Import
    </v-btn>
    <v-form @submit.prevent="save">
      <div>
        <v-card class="pa-3">
          <v-card-title class="headline">Import Users</v-card-title>
          <v-card-text>
            <div
              class="select-file"
              :class="{ 'drop-file': isDragged }">
              <v-btn @click="launchFilePicker" color="info">
                <v-icon>mdi-upload</v-icon>
                Upload .xslx or .csv file
              </v-btn>
              <div>Or drag and drop file here</div>
              <v-chip v-if="filename" @input="removeFile" close>{{ filename }}</v-chip>
              <div class="errors-list">{{ vErrors.collect('file')[0] }}</div>
              <input
                v-show="isDragged"
                ref="dropZone"
                v-validate="inputValidation"
                @change="onFileSelected"
                @dragend="hideDropZone"
                @dragover="showDropZone"
                @dragenter="showDropZone"
                @dragleave="hideDropZone"
                @drop="hideDropZone"
                class="drop-zone"
                name="file"
                type="file" />
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-fade-transition>
              <v-btn
                v-show="serverErrorsReport"
                @click="downloadErrorsFile"
                color="error">
                <v-icon>mdi-cloud-download</v-icon>Errors
              </v-btn>
            </v-fade-transition>
            <v-btn @click="close">Cancel</v-btn>
            <v-btn :disabled="importDisabled" color="success" type="submit">
              <span v-if="!importing">Import</span>
              <v-icon v-else>mdi-loading mdi-spin</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-form>
  </v-dialog>
</template>

<script>
import api from '@/admin/api/user';
import saveAs from 'save-as';
import { withFocusTrap } from '@/common/focustrap';
import { withValidation } from '@/common/validation';

const el = vm => vm.$children[0].$refs.dialog;
const inputFormats = {
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'text/csv': 'csv'
};

export default {
  name: 'import-dialog',
  mixins: [withValidation(), withFocusTrap({ el })],
  data() {
    return {
      showDialog: false,
      importing: false,
      filename: null,
      form: null,
      isDragged: false,
      serverErrorsReport: null
    };
  },
  computed: {
    importDisabled() {
      return !this.filename || this.vErrors.any() || this.importing;
    },
    inputValidation: () => ({ required: true, mimes: Object.keys(inputFormats) })
  },
  methods: {
    showDropZone() {
      if (this.showDialog) {
        this.$refs.dialog.overlay.style.backgroundColor = 'rgba(0,191,255, 0.5)';
        this.isDragged = true;
      }
    },
    hideDropZone() {
      this.$refs.dialog.overlay.style.backgroundColor = '';
      this.isDragged = false;
    },
    removeFile() {
      this.filename = null;
      this.form = null;
      this.$refs.dropZone.value = null;
      this.isDragged = false;
      this.resetErrors();
    },
    launchFilePicker() {
      this.$refs.dropZone.click();
    },
    onFileSelected(e) {
      this.form = new FormData();
      this.resetErrors();
      const [file] = e.target.files;
      if (!file) {
        this.filename = null;
        return;
      }
      this.filename = file.name;
      return this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        this.form.append('file', file, file.name);
      });
    },
    close() {
      if (this.importing) return;
      this.filename = null;
      this.isDragged = false;
      this.$refs.dropZone.value = null;
      this.resetErrors();
      this.showDialog = false;
    },
    save() {
      this.importing = true;
      return api.bulkImport(this.form).then(response => {
        this.importing = false;
        if (response.data.size) {
          this.$nextTick(() => this.$refs.fileName.focus());
          this.vErrors.add({ field: 'file', msg: 'All users aren\'t imported' });
          this.serverErrorsReport = response.data;
          return;
        }
        this.$emit('imported');
        this.close();
      }).catch(err => {
        this.importing = false;
        this.vErrors.add({ field: 'file', msg: 'Importing users failed.' });
        this.$nextTick(() => this.$refs.fileName.focus());
        return Promise.reject(err);
      });
    },
    downloadErrorsFile() {
      const extension = inputFormats[this.serverErrorsReport.type];
      saveAs(this.serverErrorsReport, `Errors.${extension}`);
      this.$refs.fileName.focus();
    },
    resetErrors() {
      this.serverErrorsReport = null;
      this.vErrors.clear();
    }
  },
  watch: {
    showDialog(val) {
      this.$nextTick(() => this.focusTrap.toggle(val));
    }
  },
  mounted() {
    window.addEventListener('dragenter', this.showDropZone);
  }
};
</script>

<style lang="scss" scoped>
.v-btn .v-icon {
  padding-right: 6px;
}

.v-card__actions {
  margin-top: 20px;
}

.select-file {
  padding: 50px 10px;
  text-align: center;
  background-color: #f5f5f5;
  border-radius: 5px;
  color:gray;
}

.drop-file {
  background-color: #eee;
  outline: 2px dashed #aaa;
  outline-offset: -10px;
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
