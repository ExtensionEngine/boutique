<template>
  <modal :show="show" @close="close">
    <div class="user-modal">
      <h1 class="title is-4">Edit School</h1>
      <v-input
        v-model="obj.name"
        name="name"
        validate="required|min:2|max:50"/>
      <v-input
        v-model="obj.state"
        name="state"
        validate="required|min:2|max:2"/>
      <v-select
        v-model="obj.level"
        :options="enums.level"
        name="level"/>
      <v-select
        v-model="obj.status"
        :options="enums.status"
        name="status"/>
      <v-select
        v-model="obj.type"
        :options="enums.type"
        name="type"/>
      <hr/>
      <div class="controls">
        <div>
          <button @click="validateAndSave" class="button is-primary">Save</button>
          <button @click="close" class="button">Cancel</button>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import { mapActions } from 'vuex';
import { withValidation } from '@/common/validation';
import cloneDeep from 'lodash/cloneDeep';
import humanize from 'humanize-string';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import Modal from '@/common/components/Modal';
import VInput from '@/common/components/form/VInput';
import VSelect from '@/common/components/form/VSelect';
import { enums } from '../../../../server/school/enums';

const resetData = () => {
  return {
    name: '',
    state: '',
    level: '',
    status: '',
    type: ''
  };
};

export default {
  name: 'school-modal',
  mixins: [withValidation()],
  props: {
    show: { type: Boolean, default: false },
    schoolData: { type: Object, required: true }
  },
  data() {
    return { obj: resetData() };
  },
  computed: {
    enums() {
      // TODO: dry this up
      return {
        level: map(enums.level, it => ({ label: humanize(it), value: it })),
        status: map(enums.status, it => ({ label: humanize(it), value: it })),
        type: map(enums.type, it => ({ label: humanize(it), value: it }))
      };
    }
  },
  methods: {
    ...mapActions('schools', ['save']),
    close() {
      this.data = resetData();
      this.$emit('close');
    },
    validateAndSave() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        this.save(this.obj);
        this.close();
      });
    }
  },
  watch: {
    show(val) {
      if (!val) return;
      this.vErrors.clear();
      if (!isEmpty(this.schoolData)) this.obj = cloneDeep(this.schoolData);
    }
  },
  components: { Modal, VInput, VSelect }
};
</script>
