<template>
  <v-dialog
    v-model="visible"
    v-hotkey="{ esc: close }"
    persistent
    no-click-animation
    width="700">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" color="blue-grey" outlined>
        <v-icon>mdi-cloud-upload</v-icon>Import
      </v-btn>
    </template>
    <validation-observer
      v-if="visible"
      ref="form"
      v-slot="{ invalid }"
      @submit.prevent="$refs.form.handleSubmit(submit)"
      tag="form"
      novalidate>
      <v-card class="pa-3">
        <v-card-title class="headline">Import Users</v-card-title>
        <v-card-text>
          <validation-provider
            v-slot="{ errors }"
            :rules="inputValidation"
            name="file"
            slim>
            <v-file-input
              v-model="file"
              :accept="acceptedFiles"
              :error-messages="errors"
              :disabled="importing"
              prepend-icon="mdi-attachment"
              label="Upload .xlsx or .csv file" />
          </validation-provider>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="downloadTemplateFile" text color="blue-grey">
            Download Template
          </v-btn>
          <v-spacer />
          <v-fade-transition>
            <v-btn
              v-show="serverErrorsReport"
              @click="downloadErrorsFile"
              color="error">
              <v-icon>mdi-cloud-download</v-icon>Errors
            </v-btn>
          </v-fade-transition>
          <v-btn @click="close">Cancel</v-btn>
          <v-btn :disabled="importing || invalid" color="success" type="submit">
            <span v-if="!importing">Import</span>
            <v-icon v-else>mdi-loading mdi-spin</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </validation-observer>
  </v-dialog>
</template>

<script>
import api from '@/admin/api/user';
import saveAs from 'save-as';

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
    serverErrorsReport: null
  }),
  computed: {
    inputValidation: () => ({ required: true, mimes: Object.keys(inputFormats) }),
    acceptedFiles: () => Object.keys(inputFormats)
  },
  methods: {
    close() {
      if (this.importing) return;
      this.file = null;
      this.serverErrorsReport = null;
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
        const message = `${count} users were successfully imported.`;
        this.$refs.validationObserver.setErrors({ File: [message] });
        this.serverErrorsReport = data;
      }).catch(err => {
        this.importing = false;
        const message = 'Importing users failed.';
        this.$refs.validationObserver.setErrors({ File: [message] });
        return Promise.reject(err);
      });
    },
    downloadErrorsFile() {
      const extension = inputFormats[this.serverErrorsReport.type];
      saveAs(this.serverErrorsReport, `Errors.${extension}`);
    },
    async downloadTemplateFile() {
      const { data } = await api.getImportTemplate();
      saveAs(data, 'Template.xlsx');
    }
  }
};
</script>

<style lang="scss" scoped>
.v-form input {
  display: none;
}

.v-btn .v-icon {
  padding-right: 0.375rem;
}

.v-text-field ::v-deep {
  .v-text-field__slot {
    cursor: pointer;

    input {
      pointer-events: none;
    }
  }

  .mdi {
    transform: rotate(-90deg);
  }
}

.v-card__actions {
  margin-top: 1.25rem;
}
</style>
