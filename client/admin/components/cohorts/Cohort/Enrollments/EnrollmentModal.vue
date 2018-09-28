<template>
  <v-dialog v-model="visible" width="500">
    <v-btn slot="activator" color="success" outline>Enroll learner</v-btn>
    <v-card class="pa-3">
      <v-card-title class="headline">Enroll learner</v-card-title>
      <v-card-text>
        <v-autocomplete
          v-validate="{
            required: true,
            'unique-enrollment': { studentId, cohortId }
          }"
          v-model="studentId"
          :items="students"
          :search-input.sync="email"
          :error-messages="vErrors.collect('learner')"
          :loading="isLoading"
          label="Learner"
          placeholder="Start typing to Search"
          prepend-icon="search"
          clearable
          name="learner"/>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn @click="close">Cancel</v-btn>
        <v-btn @click="enroll" color="success" outline>Enroll</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import api from '@/admin/api/user';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { mapActions } from 'vuex';
import pick from 'lodash/pick';
import request from '@/common/api/request';
import { withValidation } from '@/common/validation';

export default {
  name: 'enollment-modal',
  mixins: [withValidation()],
  props: {
    cohortId: { type: Number, required: true }
  },
  data() {
    return {
      visible: false,
      email: null,
      studentId: null,
      students: [],
      isLoading: false
    };
  },
  methods: {
    ...mapActions('enrollments', ['save']),
    enroll() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        this.save(pick(this, ['studentId', 'cohortId']));
        this.close();
      });
    },
    close() {
      this.visible = false;
      this.studentId = null;
    },
    fetch(email) {
      if (this.studentId) return;
      this.isLoading = true;
      const params = { emailLike: email, role: 'STUDENT' };
      api.fetch({ params }).then(({ items: students }) => {
        this.isLoading = false;
        this.students = map(students, it => ({
          text: `${it.email} - ${it.firstName} ${it.lastName}`, value: it.id
        }));
      });
    }
  },
  watch: {
    email(val) {
      if (val) this.fetch(val);
    }
  },
  created() {
    this.fetch();
  },
  mounted() {
    if (this.$validator.rules['unique-enrollment']) return;
    this.$validator.extend('unique-enrollment', {
      getMessage: field => `Learner is already enrolled!`,
      validate: (option, [params]) => {
        return request.get('/enrollments', { params })
          .then(res => ({ valid: isEmpty(res.data.data) }));
      }
    });
  }
};
</script>
