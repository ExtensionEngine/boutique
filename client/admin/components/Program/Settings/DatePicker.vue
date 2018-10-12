<template>
  <v-layout row wrap>
    <v-flex xs12 sm6 md4>
      <v-menu
        ref="menu"
        :close-on-content-click="false"
        v-model="menu"
        :nudge-right="40"
        :return-value.sync="date"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        min-width="290px">
        <v-text-field
          slot="activator"
          v-model="modelDate"
          :label="data.label"
          append-icon="event"
          readonly
        ></v-text-field>
        <v-date-picker v-model="date" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn @click="menu = false" flat color="primary">Cancel</v-btn>
          <v-btn @click="save(date)" flat color="primary">Save</v-btn>
        </v-date-picker>
      </v-menu>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: {
    data: { type: Object, required: true },
    program: { type: Object, required: true }
  },
  data: () => ({
    date: null,
    menu: false
  }),
  computed: {
    modelDate() {
      return (this.program[this.data.attr] || this.date || ' ').substring(0, 10);
    }
  },
  methods: {
    ...mapActions('programs', { saveProgram: 'save' }),
    save(date) {
      this.$refs.menu.save(date);
      this.program[this.data.attr] = date;
      this.saveProgram(this.program);
    }
  }
};
</script>
