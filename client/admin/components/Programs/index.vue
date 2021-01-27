<template>
  <v-container fluid>
    <v-row class="ma-5">
      <v-col lg="4" md="6">
        <v-text-field
          v-model="filter"
          append-icon="mdi-magnify"
          label="Search"
          single-line hide-details clearable />
        <v-checkbox
          v-model="showArchived"
          label="Show archived"
          class="my-2 archived-checkbox"
          hide-details />
      </v-col>
      <v-col lg="8" md="6" class="d-flex justify-end">
        <create-dialog @created="fetch(defaultPage)" />
      </v-col>
    </v-row>
    <v-data-iterator
      :items="programs"
      :options="options"
      :server-items-length="totalItems"
      :footer-props="{ itemsPerPageOptions: [30, 60, 90, -1] }"
      :hide-default-footer="totalItems < options.itemsPerPage">
      <template slot-scope="{ items: programs }">
        <v-row class="my-1 mx-5">
          <v-col
            v-for="program in programs"
            :key="program.id"
            cols="12"
            lg="4">
            <v-card
              color="primary"
              min-height="180"
              dark
              class="d-flex flex-column justify-space-between">
              <v-card-title class="headline grey--text text--lighten-3">
                {{ program.name }}
              </v-card-title>
              <v-card-actions class="justify-end">
                <v-btn
                  :to="{
                    name: 'enrollments',
                    params: { programId: program.id }
                  }"
                  color="secondary"
                  text>
                  Open
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
import api from '@/admin/api/program';
import CreateDialog from './CreateDialog';
import { mapState } from 'vuex';
import throttle from 'lodash/throttle';

const defaultPage = () => ({ sortBy: ['updatedAt'], sortDesc: [true], page: 1 });

export default {
  name: 'program-list',
  data: () => ({
    programs: [],
    filter: null,
    dataTable: defaultPage(),
    totalItems: 0,
    showArchived: false,
    options: { itemsPerPage: 100 }
  }),
  computed: {
    ...mapState('auth', ['user']),
    defaultPage
  },
  methods: {
    fetch: throttle(async function (opts) {
      Object.assign(this.dataTable, opts);
      const { items, total } = await api.fetch({
        ...this.dataTable,
        filter: this.filter,
        archived: this.showArchived
      });
      this.programs = items;
      this.totalItems = total;
    }, 400)
  },
  watch: {
    dataTable: 'fetch',
    filter: 'fetch',
    showArchived: 'fetch'
  },
  created() {
    this.fetch();
  },
  components: {
    CreateDialog
  }
};
</script>

<style lang="scss" scoped>
::v-deep .archived-checkbox {
  &.v-input--checkbox {
    justify-content: flex-end;
  }

  .v-input__slot {
    flex-direction: row-reverse;

    .v-input--selection-controls__input {
      justify-content: center;
      margin-right: 0;
    }

    .v-icon {
      font-size: 1.125rem;
    }

    label {
      font-size: 0.875rem;
    }
  }
}
</style>
