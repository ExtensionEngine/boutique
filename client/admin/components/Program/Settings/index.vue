<template>
  <div class="mt-3">
    <v-toolbar color="#f5f5f5" flat>
      <v-spacer/>
      <v-btn @click="confirmationDialog = true" color="error" outline>
        Delete Program
      </v-btn>
      <confirmation-dialog
        :visible.sync="confirmationDialog"
        :action="() => $router.push({ name: 'users' })"
        @confirmed="remove(program)"
        heading="Delete program"
        message="Are you sure you want to delete program?"/>
    </v-toolbar>
    <v-layout>
      <v-flex xs12 sm6 md4>
        <form @submit.prevent="saveProgram(disabled)">
          <v-text-field
            v-validate="'required|min:2|max:255'"
            v-model="program.name"
            :disabled="disabled"
            :error-messages="vErrors.collect('name')"
            label="Program name"
            append-icon="edit"
            data-vv-name="name"/>
          <date-picker
            v-validate="'date_format:YYYY-MM-DD'"
            ref="startDate"
            v-model="program.startDate"
            :disabled="disabled"
            :error-messages="vErrors.collect('startDate')"
            label="Start date"
            data-vv-as="Start Date"
            data-vv-name="startDate"/>
          <date-picker
            v-validate="'date_format:YYYY-MM-DD|after:$startDate'"
            v-model="program.endDate"
            :error-messages="vErrors.collect('endDate')"
            :disabled="disabled"
            label="End date"
            data-vv-as="End Date"
            data-vv-name="endDate"/>
          <v-flex class="text-xs-right">
            <v-btn :color="disabled ? 'info' : 'success'" type="submit" small>
              {{ disabled ? 'Edit' : 'Save' }}
            </v-btn>
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
    ...mapActions('programs', ['save', 'remove']),
    cloneProgram() {
      this.program = cloneDeep({
        ...this.programData,
        startDate: formatDate(this.programData.startDate),
        endDate: formatDate(this.programData.endDate)
      });
    },
    saveProgram(disabled) {
      if (disabled) {
        this.vErrors.clear();
        this.toggleForm();
      } else {
        this.$validator.validateAll().then(isValid => {
          if (!isValid) return;
          this.save(this.program);
          this.toggleForm();
        });
      }
    },
    toggleForm() {
      this.disabled = !this.disabled;
    }
  },
  created() {
    this.cloneProgram();
  },
  components: { ConfirmationDialog, DatePicker }
};
</script>
