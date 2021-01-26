<template>
  <v-dialog v-model="visible" v-hotkey="{ esc: close }" width="600">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" text>
        <v-icon dense class="mr-1">mdi-plus</v-icon>
        Create
      </v-btn>
    </template>
    <validation-observer
      v-if="visible"
      ref="form"
      @submit.prevent="$refs.form.handleSubmit(save)"
      tag="form"
      novalidate>
      <v-card class="pa-3">
        <v-card-title class="headline">New Program</v-card-title>
        <v-card-text>
          <validation-provider
            v-slot="{ errors }"
            :rules="{ required: true, min: 2, max: 255, unique_program_name: null }"
            name="name">
            <v-text-field
              v-model.trim="program.name"
              :error-messages="errors"
              name="name"
              label="Name" />
          </validation-provider>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="close">Cancel</v-btn>
          <v-btn color="success" outlined type="submit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </validation-observer>
  </v-dialog>
</template>

<script>
import api from '@/admin/api/program';

const getDefaultData = () => ({ name: '' });

export default {
  name: 'program-dialog',
  data: () => ({
    visible: false,
    program: getDefaultData()
  }),
  methods: {
    close() {
      this.visible = false;
    },
    save() {
      api.create(this.program).then(() => this.$emit('created'));
      this.close();
    }
  },
  watch: {
    visible(val) {
      if (!val) return;
      this.program = getDefaultData();
    }
  }
};
</script>
