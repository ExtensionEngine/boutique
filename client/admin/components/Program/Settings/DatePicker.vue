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
          v-model="date"
          :label="dateLabel"
          append-icon="event"
          readonly
        ></v-text-field>
        <v-date-picker v-model="date" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn @click="menu = false" flat color="primary">Cancel</v-btn>
          <v-btn @click="$refs.menu.save(date)" flat color="primary">Save</v-btn>
        </v-date-picker>
      </v-menu>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: {
    dateLabel: { type: String, required: true }
  },
  data: () => ({
    date: null,
    menu: false
  })
};
</script>
