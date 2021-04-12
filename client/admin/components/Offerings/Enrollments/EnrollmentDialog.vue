<template>
  <admin-dialog v-model="isVisible" header-icon="mdi-school">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" text>
        <v-icon dense class="mr-1">mdi-school</v-icon>
        Enroll learner
      </v-btn>
    </template>
    <template v-slot:header>Enroll learner</template>
    <template v-slot:body>
      <validation-observer
        v-if="isVisible"
        ref="form"
        v-slot="{ invalid }"
        @submit.prevent="$refs.form.handleSubmit(enroll)"
        tag="form"
        novalidate>
        <validation-provider
          v-slot="{ errors }"
          :rules="{ required: true, unique_enrollment: { learnerId, offeringId } }"
          name="learner">
          <v-autocomplete
            v-model="learnerId"
            :items="learners"
            :error-messages="errors"
            :search-input.sync="email"
            :loading="isLoading"
            name="learner"
            label="Learner"
            placeholder="Start typing to Search"
            prepend-icon="mdi-magnify"
            clearable />
        </validation-provider>
        <div class="d-flex justify-end">
          <v-btn @click="close" text>Cancel</v-btn>
          <v-btn :disabled="invalid" type="submit" text>Enroll</v-btn>
        </div>
      </validation-observer>
    </template>
  </admin-dialog>
</template>

<script>
import AdminDialog from '@/admin/components/common/Dialog';
import enrollmentApi from '@/admin/api/enrollment';
import map from 'lodash/map';
import pick from 'lodash/pick';
import userApi from '@/admin/api/user';

export default {
  name: 'enrollment-dialog',
  props: {
    offeringId: { type: Number, required: true }
  },
  data: () => ({
    isVisible: false,
    email: null,
    learnerId: null,
    learners: [],
    isLoading: false
  }),
  methods: {
    async enroll() {
      const params = pick(this, ['learnerId', 'offeringId']);
      await enrollmentApi.create(params);
      this.close();
      this.$emit('enrolled');
    },
    close() {
      this.isVisible = false;
      this.learnerId = null;
    },
    setLearners({ items: learners }) {
      this.learners = map(learners, ({ id, email, firstName, lastName }) => ({
        value: id,
        text: `${email} - ${firstName} ${lastName}`
      }));
    },
    fetch(email) {
      if (this.learnerId) return;
      this.isLoading = true;
      const params = { emailLike: email, role: 'USER', limit: 30 };
      return userApi.fetch({ params })
        .then(this.setLearners)
        .finally(() => (this.isLoading = false));
    }
  },
  watch: {
    email(val) {
      if (val) this.fetch(val);
    },
    isVisible(val) {
      if (!val) return;
      this.fetch();
    }
  },
  components: { AdminDialog }
};
</script>
