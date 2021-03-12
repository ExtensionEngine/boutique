<template>
  <v-row class="ma-4">
    <v-col sm="12" lg="6">
      <div class="d-flex justify-end mb-5">
        <v-btn @click="showConfirmationDialog = true" color="error" text>
          <v-icon dense class="mr-1">mdi-delete-outline</v-icon>
          Delete Program
        </v-btn>
      </div>
      <validation-observer
        ref="form"
        @submit.prevent="$refs.form.handleSubmit(saveProgram)"
        tag="form"
        novalidate>
        <validation-provider
          v-slot="{ errors }"
          :rules="{ required: true, min: 2, max: 255, unique_program_name: program }"
          name="program name">
          <v-text-field
            v-model.trim="programData.name"
            :disabled="!isEditing"
            :error-messages="errors"
            name="name"
            label="Program name"
            append-icon="mdi-pencil" />
        </validation-provider>
        <date-picker
          v-model="programData.startDate"
          :disabled="!isEditing"
          name="startDate"
          label="Start Date" />
        <validation-provider
          v-slot="{ errors }"
          :rules="{ after: programData.startDate }"
          name="end date">
          <date-picker
            v-model="programData.endDate"
            :disabled="!isEditing"
            :error-messages="errors"
            name="endDate"
            label="End Date" />
        </validation-provider>
        <div class="d-flex justify-end">
          <template v-if="isEditing">
            <v-btn @click="cancel" text>Cancel</v-btn>
            <v-btn type="submit" text>Save</v-btn>
          </template>
          <v-btn v-else @click="isEditing = true" text>Edit</v-btn>
        </div>
      </validation-observer>
    </v-col>
    <confirmation-dialog
      :visible.sync="showConfirmationDialog"
      :action="removeProgram"
      :message="confirmationMessage"
      heading="Delete program" />
  </v-row>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import ConfirmationDialog from '@/admin/components/common/ConfirmationDialog.vue';
import DatePicker from '@/admin/components/common/DatePicker.vue';
import format from 'date-fns/format';
import { mapActions } from 'vuex';

const DST_FORMAT = 'yyyy-MM-dd';
const formatDate = d => d && format(new Date(d), DST_FORMAT);

export default {
  name: 'program-settings',
  props: {
    program: { type: Object, required: true }
  },
  data: () => ({
    programData: null,
    isEditing: false,
    showConfirmationDialog: false
  }),
  computed: {
    dateFormat: () => DST_FORMAT,
    confirmationMessage: vm => `Are you sure you want to delete "${vm.program.name}"?`
  },
  methods: {
    ...mapActions('programs', ['save', 'remove']),
    saveProgram() {
      this.save(this.programData);
      this.isEditing = false;
    },
    removeProgram() {
      this.remove(this.program)
        .then(() => this.$router.push({ name: 'programs' }));
    },
    cloneProgram() {
      const { program } = this;
      this.programData = cloneDeep({
        ...program,
        startDate: formatDate(program.startDate),
        endDate: formatDate(program.endDate)
      });
    },
    cancel() {
      this.$refs.form.reset();
      this.cloneProgram();
      this.isEditing = false;
    }
  },
  created() {
    this.cloneProgram();
  },
  components: { ConfirmationDialog, DatePicker }
};
</script>
