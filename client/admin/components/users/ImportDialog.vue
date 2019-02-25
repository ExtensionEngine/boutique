<template>
  <v-dialog
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
              :class="{ 'drop-file': isDragged }"
              class="select-file">
              <v-btn @click="launchFilePicker" color="info">
                <v-icon>mdi-upload</v-icon>
                Upload .xslx or .csv file
              </v-btn>
              <div>Or drag and drop file here</div>
              <input
                ref="fileInput"
                v-validate="inputValidation"
                @change="onFileSelected"
                id="userImportInput"
                name="file"
                type="file">
              <v-chip v-if="filename" @input="removeFile" close>{{ filename }}</v-chip>
              <div class="errors-list">{{ vErrors.collect('file')[0] }}</div>
              <div
                v-if="isDragged"
                ref="dropZone"
                @drag.stop.prevent
                @dragstart.stop.prevent
                @dragend.stop.prevent="isDragged = false"
                @dragover.stop.prevent="isDragged = true"
                @dragenter.stop.prevent="isDragged = true"
                @dragleave.stop.prevent="isDragged = false"
                @drop.stop.prevent="onFilesDroped"
                class="drop-zone"/>
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
    inputValidation: () => ({ required: false, mimes: Object.keys(inputFormats) })
  },
  methods: {
    showDropZone() {
      this.isDragged = true;
    },
    removeFile() {
      this.filename = null;
      this.form = null;
      this.$refs.fileInput.value = null;
      this.isDragged = false;
      this.resetErrors();
    },
    launchFilePicker() {
      this.$refs.fileInput.click();
    },
    onFileSelected(e) {
      this.fileToForm(e.target.files);
    },
    onFilesDroped(e) {
      this.fileToForm(e.dataTransfer.files);
      this.isDragged = false;
    },
    fileToForm(files) {
      this.form = new FormData();
      this.resetErrors();
      const [file] = files;
      if (!file) {
        this.filename = null;
        return;
      }
      this.filename = file.name;
      console.log(file);
      return this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        this.form.append('file', file, file.name);
      });
    },
    close() {
      if (this.importing) return;
      this.filename = null;
      this.isDragged = false;
      this.$refs.fileInput.value = null;
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
.v-form input {
  display: none;
}

.v-btn .v-icon {
  padding-right: 6px;
}

.v-text-field {
  /deep/ .v-text-field__slot {
    cursor: pointer;

    input {
      pointer-events: none;
    }
  }

  /deep/ .mdi {
    transform: rotate(-90deg);
  }
}

.v-card__actions {
  margin-top: 20px;
}

.loader-container {
  display: flex;
  justify-content: center;
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
