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
      <v-input
        v-model="obj.ncesSchoolLevel"
        name="ncesSchoolLevel"/>
      <v-input
        v-model="obj.ncesStatus"
        name="ncesStatus"/>
      <v-input
        v-model="obj.ncesType"
        name="ncesType"/>
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
import isEmpty from 'lodash/isEmpty';
import Modal from '@/common/components/Modal';
import VInput from '@/common/components/form/VInput';
import VSelect from '@/common/components/form/VSelect';

const resetData = () => {
  return {
    name: '',
    state: '',
    ncesSchoollevel: '',
    ncesStatus: '',
    ncesType: ''
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
