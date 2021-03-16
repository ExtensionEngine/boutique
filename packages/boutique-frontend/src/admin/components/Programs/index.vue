<template>
  <v-container fluid class="pa-8">
    <v-row class="toolbar">
      <v-col lg="4" md="6">
        <v-text-field
          v-model="filter"
          :append-icon="mdiMagnify"
          label="Search"
          single-line hide-details clearable />
        <v-checkbox
          v-model="showArchived"
          label="Show archived"
          hide-details
          class="my-2 archived-checkbox" />
      </v-col>
      <v-col lg="8" md="6" class="d-flex justify-end">
        <create-dialog @created="fetch(defaultPage)" />
      </v-col>
    </v-row>
    <v-data-iterator
      :items="programs"
      :options.sync="options"
      :footer-props="{ itemsPerPageOptions: [30, 60, 90, -1] }"
      :server-items-length="totalItems"
      :hide-default-footer="totalItems < options.itemsPerPage">
      <template slot-scope="{ items: programs }">
        <v-row>
          <v-col
            v-for="({ id, name }) in programs"
            :key="id"
            lg="4"
            sm="12">
            <v-card
              color="primary"
              min-height="200"
              dark
              class="d-flex flex-column justify-space-between">
              <v-card-title class="text-h5 grey--text text--lighten-3">
                {{ name }}
              </v-card-title>
              <v-card-actions class="justify-end">
                <v-btn
                  :to="{ name: 'enrollments', params: { programId: id } }"
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
import { mdiMagnify } from '@mdi/js';
import throttle from 'lodash/throttle';

const defaultPage = () => ({ page: 1, sortBy: ['updatedAt'], sortDesc: [true] });

export default {
  name: 'program-list',
  data: () => ({
    mdiMagnify,
    programs: [],
    filter: null,
    totalItems: 0,
    showArchived: false,
    options: { itemsPerPage: 30, ...defaultPage() }
  }),
  computed: {
    defaultPage
  },
  methods: {
    fetch: throttle(async function (opts) {
      Object.assign(this.options, opts);
      const { items, total } = await api.fetch({
        ...this.options,
        params: {
          filter: this.filter,
          deleted: this.showArchived
        }
      });
      this.programs = items;
      this.totalItems = total;
    }, 400)
  },
  watch: {
    options: 'fetch',
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
.toolbar ::v-deep .archived-checkbox {
  &.v-input--checkbox {
    justify-content: flex-end;
  }

  .v-input__slot {
    flex-direction: row-reverse;

    .v-input--selection-controls__input {
      margin-right: 0;
    }

    .v-icon {
      height: 1.125rem;
    }

    label {
      font-size: 0.875rem;
    }
  }
}
</style>
