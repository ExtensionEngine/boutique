<template>
  <v-dialog v-model="visible" width="500">
    <v-btn slot="activator" color="success" outline>Enroll learner</v-btn>
    <v-form @submit.prevent="enroll">
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
          <v-btn color="success" outline type="submit">Enroll</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import enrollmentApi from '@/admin/api/enrollment';
import map from 'lodash/map';
import pick from 'lodash/pick';
import userApi from '@/admin/api/user';
import { withValidation } from '@/common/validation';

export default {
  name: 'enrollment-dialog',
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
    enroll() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        enrollmentApi.create(pick(this, ['studentId', 'cohortId'])).then(() => {
          this.close();
          this.$emit('enrolled');
        });
      });
    },
    close() {
      this.visible = false;
      this.studentId = null;
    },
    fetch(email) {
      if (this.studentId) return;
      this.isLoading = true;
      const params = { emailLike: email, role: 'STUDENT', limit: 30 };
      return userApi.fetch({ params }).then(({ items: students }) => {
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
    },
    visible(val) {
      if (!val) return;
      this.vErrors.clear();
      this.fetch();
    }
  },
  mounted() {
    if (this.$validator.rules['unique-enrollment']) return;
    this.$validator.extend('unique-enrollment', {
      getMessage: field => `Learner is already enrolled!`,
      validate: (option, [params]) => {
        return enrollmentApi.fetch({ params }).then(res => !res.total);
      }
    });
  }
};
</script>
