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
    <date-picker :data="startingDate" :program="program"/>
    <date-picker :data="endingDate" :program="program"/>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ConfirmationDialog from '@/admin/components/common/ConfirmationDialog';
import DatePicker from './DatePicker';
import find from 'lodash/find';

export default {
  name: 'settings',
  props: { programId: { type: Number, required: true } },
  data() {
    return {
      confirmationDialog: null,
      confirmationAction: null,
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
      return find(this.programs, { id: this.programId });
    }
  },
  methods: {
    ...mapActions('programs', { removeProgram: 'remove' }),
    remove(program) {
      this.confirmationDialog = true;
      this.confirmationAction = () => {
        this.removeProgram(program);
        this.$router.push({ name: 'users' });
      };
    }
  },
  components: { ConfirmationDialog, DatePicker }
};
</script>
