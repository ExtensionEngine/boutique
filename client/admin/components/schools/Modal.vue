<template>
  <modal :show="show" @close="close">
    <div class="user-modal">
      <h1 class="title is-4">Edit School</h1>
      <v-input
        v-model="obj.name"
        name="name"
        validate="required|min:2|max:50"/>
      <v-select
        v-model="obj.state"
        :options="states"
        name="state"/>
      <v-select
        v-model="obj.level"
        :options="levels"
        name="level"/>
      <v-select
        v-model="obj.status"
        :options="statuses"
        name="status"/>
      <v-select
        v-model="obj.type"
        :options="types"
        name="type"/>
      <hr>
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
import map from 'lodash/map';
import VInput from '@/common/components/form/VInput';
import VSelect from '@/common/components/form/VSelect';
import { format } from '../../../../common/util/enum';
import { Level, Status, Type } from '../../../../common/constants/school';
import states from '../../../../common/constants/usStates';

const resetData = () => ({ name: '', state: '', level: '', status: '', type: '' });

export default {
  name: 'school-modal',
  mixins: [withValidation()],
  props: {
    show: { type: Boolean, default: false },
    schoolData: { type: Object, required: true }
  },
  data() {
    return {
      obj: resetData(),
      levels: format(Level),
      statuses: format(Status),
      types: format(Type)
    };
  },
  computed: {
    states() {
      return map(states, (label, value) => ({ label, value }));
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
