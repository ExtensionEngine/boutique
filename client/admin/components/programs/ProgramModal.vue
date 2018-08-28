<template>
  <modal :show="show" @close="close">
    <div class="program-modal">
      <h2 class="title is-4">{{ programData ? 'Edit' : 'Create' }} Program</h2>
      <form @submit.prevent="save">
        <v-input
          v-model="program.name"
          name="name"
          validate="required|min:2|max:255">
        </v-input>
        <v-input
          v-model="program.description"
          name="description"
          validate="required|min:2|max:2000">
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
import { withValidation } from '@/common/validation';

const reset = () => ({ name: '', description: '' });

export default {
  name: 'program-modal',
  mixins: [withValidation()],
  props: {
    show: { type: Boolean, default: false },
    programData: { type: Object, default() { return {}; } }
  },
  data() {
    return { program: reset() };
  },
  methods: {
    ...mapActions('programs', { saveProgram: 'save' }),
    close() {
      this.program = reset();
      this.$emit('close');
    },
    save() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        this.saveProgram(this.program);
        this.close();
      });
    }
  },
  watch: {
    show(val) {
      if (!val) return;
      this.vErrors.clear();
      if (!isEmpty(this.programData)) this.program = cloneDeep(this.programData);
    }
  },
  components: { Modal, VInput }
};
</script>
