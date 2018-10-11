<template>
  <div class="mt-3">
    <v-toolbar color="#f5f5f5" flat>
      <v-spacer/>
      <v-btn v-if="program" @click="remove(program)" color="error" outline>Delete Program</v-btn>
      <confirmation-dialog
        :visible.sync="confirmationDialog"
        :action="confirmationAction"
        heading="Delete program"
        message="Are you sure you want to delete program?"/>
    </v-toolbar>
  </div>

</template>

<script>
import ConfirmationDialog from '@/admin/components/common/ConfirmationDialog';
import { mapActions } from 'vuex';

export default {
  name: 'settings',
  props: { programId: { type: Number, required: true } },
  data() {
    return {
      confirmationDialog: null,
      confirmationAction: null
    };
  },
  computed: {
    program() {
      return this.$parent.program;
    }
  },
  methods: {
    ...mapActions('programs', { removeProgram: 'remove' }),
    remove(program) {
      this.confirmationDialog = true;
      this.confirmationAction = () => {
        // todo: add 'delete route' and redirect
        // this.removeProgram(program);
      };
    }
  },
  components: { ConfirmationDialog }

};
</script>
