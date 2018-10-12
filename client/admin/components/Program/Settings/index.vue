<template>
  <div v-if="program" class="mt-3">
    <v-toolbar color="#f5f5f5" flat>
      <v-spacer/>
      <v-btn v-if="program" @click="remove(program)" color="error" outline>Delete Program</v-btn>
      <confirmation-dialog
        :visible.sync="confirmationDialog"
        :action="confirmationAction"
        heading="Delete program"
        message="Are you sure you want to delete program?"/>
    </v-toolbar>
    <rename-field :name.sync="program.name" :disabled.sync="disabled"/>
    <date-picker :data="startingDate" :dateTemp.sync="program.startingDate" :disabled.sync="disabled"/>
    <date-picker :data="endingDate" :dateTemp.sync="program.endingDate" :disabled.sync="disabled"/>
    <v-flex xs12 sm6 md4>
      <div class="text-xs-right">
        <v-btn @click="edit" color="info">Edit</v-btn>
        <v-btn @click="saveChanges" color="info">Save</v-btn>
      </div>
    </v-flex>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import ConfirmationDialog from '@/admin/components/common/ConfirmationDialog';
import DatePicker from './DatePicker';
import find from 'lodash/find';
import RenameField from './RenameField';

export default {
  name: 'settings',
  props: { programId: { type: Number, required: true } },
  data() {
    return {
      confirmationDialog: null,
      confirmationAction: null,
      disabled: true,
      startingDate: {
        label: 'Starting date',
        attr: 'startingDate'
      },
      endingDate: {
        label: 'Ending date',
        attr: 'endingDate'
      }
    };
  },
  computed: {
    ...mapState('programs', { programs: 'items' }),
    program() {
      return cloneDeep(find(this.programs, { id: this.programId }));
    }
  },
  methods: {
    ...mapActions('programs', { saveProgram: 'save', removeProgram: 'remove' }),
    remove(program) {
      this.confirmationDialog = true;
      this.confirmationAction = () => {
        this.removeProgram(program);
        this.$router.push({ name: 'users' });
      };
    },
    saveChanges() {
      this.saveProgram(this.program);
    },
    edit() {
      this.disabled = !this.disabled;
    }
  },
  components: { ConfirmationDialog, DatePicker, RenameField }
};
</script>
