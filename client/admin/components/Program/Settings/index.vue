<template>
  <div class="mt-3">
    <v-toolbar color="#f5f5f5" flat>
      <v-spacer/>
      <v-btn @click="confirmationDialog = true" outline>Delete Program</v-btn>
      <confirmation-dialog
        :visible.sync="confirmationDialog"
        :action="() => $router.push({ name: 'users' })"
        @confirmed="removeProgram(programData)"
        heading="Delete program"
        message="Are you sure you want to delete program?"/>
    </v-toolbar>
    <v-layout>
      <v-flex xs12 sm6 md4>
        <form @submit.prevent="save">
          <v-text-field
            v-validate="'required|min:2|max:255'"
            :disabled="disabled"
            v-model="program.name"
            :error-messages="vErrors.collect('name')"
            label="Program name"
            append-icon="edit"
            data-vv-name="name"/>
          <date-picker
            v-validate="'date_format:YYYY-MM-DD'"
            ref="startDate"
            :disabled="disabled"
            :error-messages="vErrors.collect('startDate')"
            v-model="program.startDate"
            label="Start date"
            data-vv-as="Start Date"
            data-vv-name="startDate"/>
          <date-picker
            v-validate="'after:$startDate|date_format:YYYY-MM-DD'"
            :error-messages="vErrors.collect('endDate')"
            :disabled="disabled"
            v-model="program.endDate"
            label="End date"
            data-vv-as="End Date"
            data-vv-name="endDate"/>
          <v-flex class="text-xs-right">
            <v-btn @click="toggleForm" small>
              {{ disabled ? 'Edit' : 'Cancel' }}
            </v-btn>
            <v-btn :disabled="disabled" type="submit" small>Save</v-btn>
          </v-flex>
        </form>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import ConfirmationDialog from '@/admin/components/common/ConfirmationDialog';
import DatePicker from './DatePicker';
import format from 'date-fns/format';
import { mapActions } from 'vuex';
import { withValidation } from '@/common/validation';

const formatDate = date => date && format(new Date(date), 'YYYY-MM-DD');

export default {
  name: 'settings',
  mixins: [withValidation()],
  props: { programData: { type: Object, required: true } },
  data() {
    return {
      confirmationDialog: false,
      program: null,
      disabled: true
    };
  },
  methods: {
    ...mapActions('programs', { saveProgram: 'save', removeProgram: 'remove' }),
    cloneProgram() {
      this.program = cloneDeep({
        ...this.programData,
        startDate: formatDate(this.programData.startDate),
        endDate: formatDate(this.programData.endDate)
      });
    },
    save() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        this.saveProgram(this.program);
        this.disabled = true;
      });
    },
    toggleForm() {
      if (!this.disabled) {
        this.cloneProgram();
      }
      this.vErrors.clear();
      this.disabled = !this.disabled;
    }
  },
  created() {
    this.cloneProgram();
  },
  components: { ConfirmationDialog, DatePicker }
};
</script>
