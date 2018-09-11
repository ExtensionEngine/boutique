<template>
  <modal :show="show" @close="close">
    <div class="enrollment-modal">
      <h2 class="title is-4">Enroll user</h2>
      <v-select
        v-model="studentId"
        :options="students"
        :searchable="true"
        :isLoading="isLoading"
        :maxHeight="150"
        :validate="{
          required: true,
          'unique-enrollment': { studentId, cohortId }
        }"
        @search-change="search"
        name="student"/>
      <div class="controls field is-grouped is-grouped-right">
        <button @click="close" class="control button">Cancel</button>
        <button @click="add" class="control button is-primary">Add</button>
      </div>
    </div>
  </modal>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { mapActions } from 'vuex';
import Modal from '@/common/components/Modal';
import pick from 'lodash/pick';
import request from '@/common/api/request';
import VSelect from '@/common/components/form/VSelect';
import { withValidation } from '@/common/validation';

export default {
  name: 'enollment-modal',
  mixins: [withValidation()],
  props: {
    show: { type: Boolean, default: false },
    cohortId: { type: Number, required: true }
  },
  data() {
    return {
      isLoading: false,
      studentId: null,
      students: []
    };
  },
  methods: {
    ...mapActions('enrollments', ['save']),
    add() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        this.save(pick(this, ['studentId', 'cohortId']));
        this.close();
      });
    },
    close() {
      this.studentId = null;
      this.$emit('close');
    },
    search(email) {
      this.isLoading = true;
      const params = { emailLike: email, role: 'STUDENT' };
      request.get('/users', { params }).then(({ data: { data } }) => {
        this.isLoading = false;
        this.students = map(data, it => ({
          value: it.id, label: `${it.email} - ${it.firstName} ${it.lastName}`
        }));
      });
    }
  },
  created() {
    this.search();
  },
  mounted() {
    if (this.$validator.rules['unique-enrollment']) return;
    this.$validator.extend('unique-enrollment', {
      getMessage: field => `Student is already enrolled!`,
      validate: (option, [params]) => {
        return request.get('/enrollments', { params })
          .then(res => ({ valid: isEmpty(res.data.data) }));
      }
    });
  },
  components: { Modal, VSelect }
};
</script>

<style lang="scss" scoped>
.enrollment-modal {
  padding: 20px 10px 40px;
}

.title {
  margin-bottom: 50px;
}

.controls {
  padding-top: 60px;

  .button {
    margin-left: 6px;
  }
}
</style>
