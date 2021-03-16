<template>
  <div>
    <v-alert
      :value="showMessage"
      :color="error ? 'pink lighten-1' : 'blue-grey darken-4'"
      text
      class="mb-5">
      {{ error || 'Sending reset email...' }}
    </v-alert>
    <validation-observer
      v-if="!error"
      ref="form"
      @submit.prevent="$refs.form.handleSubmit(submit)"
      tag="form"
      novalidate>
      <validation-provider
        v-slot="{ errors }"
        name="email"
        rules="required|email">
        <v-text-field
          v-model="email"
          :error-messages="errors"
          :disabled="showMessage"
          :prepend-inner-icon="mdiEmailOutline"
          type="email"
          label="Email"
          placeholder="Email"
          outlined
          class="required" />
      </validation-provider>
      <div>
        <v-btn
          :disabled="showMessage"
          type="submit"
          block outlined>
          Send reset email
        </v-btn>
        <v-btn @click="$router.go(-1)" tag="a" text class="mt-4">
          <v-icon dense class="pr-1">{{ mdiArrowLeft }}</v-icon>Back
        </v-btn>
      </div>
    </validation-observer>
    <v-btn v-else @click.stop="resetInput" text>
      Retry
    </v-btn>
  </div>
</template>

<script>
import { mdiArrowLeft, mdiEmailOutline } from '@mdi/js';
import { mapActions } from 'vuex';

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));
const getDefaultData = () => ({
  email: '',
  showMessage: false,
  error: null
});

export default {
  data: () => ({
    ...getDefaultData(),
    mdiArrowLeft,
    mdiEmailOutline
  }),
  methods: {
    ...mapActions('auth', ['forgotPassword']),
    submit() {
      this.showMessage = true;
      Promise.all([this.forgotPassword({ email: this.email }), delay(5000)])
        .then(() => this.$router.push('/'))
        .catch(() => (this.error = 'Something went wrong!'));
    },
    resetInput() {
      Object.assign(this, getDefaultData());
    }
  }
};
</script>
