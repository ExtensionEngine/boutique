<template>
  <modal :show="show" @close="close">
    <div class="cohort-modal">
      <h2 class="title is-4">
        {{ cohortData ? 'Edit' : 'Create' }} Cohort
      </h2>
      <form @submit.prevent="save">
        <v-input
          v-model="cohort.name"
          name="name"
          validate="required|min:2|max:255">
        </v-input>
        <div class="controls field is-grouped is-grouped-right">
          <button @click="close" class="control button" type="button">Cancel</button>
          <button class="control button is-primary" type="submit">Save</button>
        </div>
      </form>
    </div>
  </modal>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import { mapActions } from 'vuex';
import Modal from '@/common/components/Modal';
import VInput from '@/common/components/form/VInput';
import VSelect from '@/common/components/form/VSelect';
import { withValidation } from '@/common/validation';

const getDefaultData = () => ({ name: '' });

export default {
  name: 'cohort-modal',
  mixins: [withValidation()],
  props: {
    show: { type: Boolean, default: false },
    cohortData: { type: Object, default: () => ({}) }
  },
  data() {
    return { cohort: getDefaultData() };
  },
  methods: {
    ...mapActions('cohorts', { saveCohort: 'save' }),
    close() {
      this.cohort = getDefaultData();
      this.$emit('close');
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
    show(val) {
      if (!val) return;
      this.vErrors.clear();
      if (isEmpty(this.cohortData)) return;
      this.cohort = cloneDeep(this.cohortData);
    }
  },
  components: { Modal, VInput, VSelect }
};
</script>
