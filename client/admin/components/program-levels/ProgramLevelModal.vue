<template>
  <modal :show="show" @close="close">
    <div class="program-level-modal">
      <h2 class="title is-4">
        {{ programLevelData ? 'Edit' : 'Create' }} Program Level</h2>
      <v-input
        v-model="programLevel.name"
        name="name"
        validate="required|min:2|max:255">
      </v-input>
      <v-select
        v-model="programLevel.programId"
        :options="programOptions"
        name="program"
        validate="required">
      </v-select>
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
import { mapActions, mapState } from 'vuex';
import { withValidation } from '@/common/validation';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import Modal from '@/common/components/Modal';
import VInput from '@/common/components/form/VInput';
import VSelect from '@/common/components/form/VSelect';

const reset = () => ({ name: '', programId: null });

export default {
  name: 'program-level-modal',
  mixins: [withValidation()],
  props: {
    show: { type: Boolean, default: false },
    programLevelData: { type: Object, default() { return {}; } }
  },
  data() {
    return { programLevel: reset() };
  },
  computed: {
    ...mapState('programs', { programs: 'items' }),
    programOptions() {
      return map(this.programs, it => ({ label: it.name, value: it.id }));
    }
  },
  methods: {
    ...mapActions('programLevels', { saveProgramLevel: 'save' }),
    close() {
      this.programLevel = reset();
      this.$emit('close');
    },
    save() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        this.saveProgramLevel(this.programLevel);
        this.close();
      });
    }
  },
  watch: {
    show(val) {
      if (!val) return;
      this.vErrors.clear();
      if (isEmpty(this.programLevelData)) return;
      this.programLevel = cloneDeep(this.programLevelData);
    }
  },
  components: { Modal, VInput, VSelect }
};
</script>

<style lang="scss" scoped>
.program-level-modal {
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
