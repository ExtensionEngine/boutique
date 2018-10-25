<template>
  <div class="mt-3">
    <v-toolbar color="#f5f5f5" flat>
      <v-spacer/>
      <v-btn @click="confirmationDialog = true" color="error" outline>
        Delete Program
      </v-btn>
    </v-toolbar>
    <v-layout>
      <v-flex xs12 sm6 md4>
        <form @submit.prevent="saveProgram()">
          <v-text-field
            v-validate="{ required: true, min: 2, max: 255 }"
            v-model="program.name"
            :error-messages="vErrors.collect('name')"
            :disabled="disabled"
            name="name"
            label="Program name"
            append-icon="edit"/>
          <date-picker
            v-validate="{ date_format: dateFormat }"
            ref="startDate"
            v-model="program.startDate"
            :disabled="disabled"
            name="startDate"
            label="Start Date"
            data-vv-as="Start Date"/>
          <date-picker
            v-validate="{ date_format: dateFormat, after: '$startDate' }"
            v-model="program.endDate"
            :disabled="disabled"
            name="endDate"
            label="End Date"
            data-vv-as="End Date"/>
          <v-flex class="text-xs-right">
            <v-btn v-show="disabled" @click="disabled = false" outline>Edit</v-btn>
            <v-btn v-show="!disabled" @click="reset" outline>Cancel</v-btn>
            <v-btn v-show="!disabled" type="submit" color="success">Save</v-btn>
          </v-flex>
        </form>
      </v-flex>
    </v-layout>
    <confirmation-dialog
      :visible.sync="confirmationDialog"
      :action="() => $router.push({ name: 'users' })"
      @confirmed="remove(program)"
      heading="Delete program"
      message="Are you sure you want to delete program?"/>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import ConfirmationDialog from '@/admin/components/common/ConfirmationDialog';
import DatePicker from '@/admin/components/common/DatePicker';
import fecha from 'fecha';
import { mapActions } from 'vuex';
import { withValidation } from '@/common/validation';

const DATE_FORMAT = 'YYYY-MM-DD';
const formatDate = date => date && fecha.format(fecha.parse(date, 'YYYY-MM-DDTHH:MM:SSZ'), DATE_FORMAT);

export default {
  name: 'settings',
  mixins: [withValidation()],
  props: { programData: { type: Object, required: true } },
  data() {
    return {
      program: null,
      disabled: true,
      confirmationDialog: false
    };
  },
  computed: {
    dateFormat: () => DATE_FORMAT
  },
  methods: {
    ...mapActions('programs', ['save', 'remove']),
    saveProgram() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        this.save(this.program);
        this.disabled = true;
      });
    },
    cloneProgram() {
      this.program = cloneDeep({
        ...this.programData,
        startDate: formatDate(this.programData.startDate),
        endDate: formatDate(this.programData.endDate)
      });
      console.log(fecha.format(fecha.parse(this.programData.startDate, 'YYYY-MM-DDTHH:MM:SSZ')));
      console.log(new Date(this.programData.startDate));
    },
    reset() {
      this.vErrors.clear();
      this.cloneProgram();
      this.disabled = true;
    }
  },
  created() {
    this.cloneProgram();
  },
  components: { ConfirmationDialog, DatePicker }
};
</script>
