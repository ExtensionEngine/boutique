<template>
  <v-dialog v-model="visible" width="600">
    <v-btn slot="activator" small flat>Create</v-btn>
    <v-card class="pa-3">
      <v-card-title class="headline">New Cohort</v-card-title>
      <v-card-text>
        <v-text-field
          v-validate="'required|min:2|max:255'"
          v-model="cohort.name"
          :error-messages="vErrors.collect('name')"
          label="Name"
          data-vv-name="name"/>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn @click="close">Cancel</v-btn>
        <v-btn @click="save" color="success" outline>Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import { mapActions } from 'vuex';
import { withValidation } from '@/common/validation';

const getDefaultData = () => ({ name: '' });

export default {
  name: 'cohort-modal',
  mixins: [withValidation()],
  data() {
    return {
      visible: false,
      cohort: getDefaultData()
    };
  },
  methods: {
    ...mapActions('cohorts', { saveCohort: 'save' }),
    close() {
      this.visible = false;
    },
    save() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        this.saveCohort(this.cohort);
        this.close();
      });
    }
  },
  watch: {
    visible(val) {
      if (!val) return;
      this.cohort = isEmpty(this.cohortData)
        ? getDefaultData()
        : cloneDeep(this.cohortData);
      this.vErrors.clear();
    }
  }
};
</script>
