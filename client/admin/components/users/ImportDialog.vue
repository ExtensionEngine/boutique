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
      <v-card class="pa-3">
        <v-card-title class="headline">Import Users</v-card-title>
        <v-card-text>
          <label for="userImportInput">
            <div
              @drag.stop.prevent
              @dragstart.stop.prevent
              @dragend.stop.prevent="isDragged = false"
              @dragover.stop.prevent="isDragged = true"
              @dragenter.stop.prevent="isDragged = true"
              @dragleave.stop.prevent="isDragged = false"
              @drop.stop.prevent="onFilesDroped"
              class="file-import"
              :class="{ dragged: isDragged }">
              <v-input :error-messages="vErrors.collect('file')">
                Chose or drop the .xlsx or .csv file!
              </v-input>
              <v-btn v-if="filename" ref="fileName">{{ filename }}</v-btn>
              <input
                ref="fileInput"
                v-validate="inputValidation"
                @change="onFileSelected"
                id="userImportInput"
                name="file"
                type="file"
                multiple>
            </div>
          </label>
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
    onFilesDroped(e) {
      this.$refs.fileInput.files = e.dataTransfer.files;
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

.file-import {
  display: block;
  border: 1px dashed gray;
  border-radius: 5px;
  padding: 25px 10px;
  text-align: center;
  color: gray;
  cursor: pointer;
}

.dragged {
  background-color: #fafafa;
}

.file-list {
  display: block;
  background-color:white;
  border-radius: 5px;
  padding: 5px;
  margin: 5px;
}

.v-input__slot{
  text-align: center;
}

</style>
