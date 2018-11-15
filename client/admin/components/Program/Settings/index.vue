<template>
  <div v-if="program" class="mt-3">
    <v-toolbar color="#f5f5f5" flat>
      <v-spacer/>
      <v-btn @click="confirmationDialog = true" color="error" outline>
        Delete Program
      </v-btn>
    </v-toolbar>
    <v-layout>
      <v-flex xs12 sm6 md4>
        <form @submit.prevent="saveProgram">
          <v-text-field
            v-validate="{
              required: true,
              min: 2,
              max: 255,
              'unique:program-name': { initialValue: program && program.name }
            }"
            v-model.trim="programData.name"
            :error-messages="vErrors.collect('name')"
            :disabled="!isEditing"
            name="name"
            label="Program name"
            append-icon="mdi-pencil"/>
          <date-picker
            v-model="programData.startDate"
            :disabled="!isEditing"
            name="startDate"
            label="Start Date"/>
          <date-picker
            v-model="programData.endDate"
            :validate="{ after: programData.startDate }"
            :disabled="!isEditing"
            name="endDate"
            label="End Date"/>
          <v-layout>
            <v-spacer/>
            <template v-if="isEditing">
              <v-btn @click="cancel" outline>Cancel</v-btn>
              <v-btn type="submit" color="success">Save</v-btn>
            </template>
            <v-btn v-else @click="isEditing = true" outline>Edit</v-btn>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
    <confirmation-dialog
      :visible.sync="confirmationDialog"
      :action="removeProgram"
      :message="confirmationMessage"
      heading="Delete program"/>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import ConfirmationDialog from '@/admin/components/common/ConfirmationDialog';
import DatePicker from '@/admin/components/common/DatePicker';
import fecha from 'fecha';
import { mapActions } from 'vuex';
import { withValidation } from '@/common/validation';

const SRC_FORMAT = 'YYYY-MM-DD';
const DST_FORMAT = 'YYYY-MM-DD';
const formatDate = d => d && fecha.format(fecha.parse(d, SRC_FORMAT), DST_FORMAT);

export default {
  name: 'program-settings',
  mixins: [withValidation()],
  props: { program: { type: Object, default: null } },
  data() {
    return {
      programData: null,
      isEditing: false,
      confirmationDialog: false
    };
  },
  computed: {
    dateFormat: () => DST_FORMAT,
    confirmationMessage() {
      return `Are you sure you want to delete "${this.program.name}"?`;
    }
  },
  methods: {
    ...mapActions('programs', ['save', 'remove']),
    saveProgram() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        this.save(this.programData);
        this.isEditing = false;
      });
    },
    removeProgram() {
      this.remove(this.program)
        .then(() => this.$router.push({ name: 'users' }));
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
      this.vErrors.clear();
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
