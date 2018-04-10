<template>
  <modal :show="show" @close="close">
    <div class="program-modal">
      <h2 class="title is-4">{{ programData ? 'Edit' : 'Create' }} Program</h2>
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
      <div class="controls">
        <div class="is-pulled-right">
          <button @click="close" class="button">Cancel</button>
          <button @click="save" class="button is-primary">Save</button>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import { mapActions } from 'vuex';
import { withValidation } from '@/common/validation';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import Modal from '@/common/components/Modal';
import VInput from '@/common/components/form/VInput';

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

<style lang="scss" scoped>
.program-modal {
  padding: 20px 10px 40px;
}

.title {
  margin-bottom: 50px;
}

.controls {
  margin-top: 26px;

  .button {
    margin-left: 6px;
  }
}
</style>
