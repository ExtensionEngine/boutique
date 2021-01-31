<template>
  <div>
    <v-alert
      :value="!!error"
      color="pink lighten-1"
      text
      class="mb-5">
      {{ error }}
    </v-alert>
    <validation-observer
      ref="form"
      @submit.prevent="$refs.form.handleSubmit(submit)"
      tag="form"
      novalidate>
      <validation-provider
        v-slot="{ errors }"
        name="password"
        rules="required|alphanumerical|min:6">
        <v-text-field
          v-model="password"
          :error-messages="errors"
          type="password"
          label="Password"
          outlined />
      </validation-provider>
      <validation-provider
        v-slot="{ errors }"
        name="password confirmation"
        :rules="{ required: true, is: password }">
        <v-text-field
          v-model="passwordConfirmation"
          :error-messages="errors"
          type="password"
          label="Confirm Password"
          outlined />
      </validation-provider>
      <v-btn type="submit" text block>Change password</v-btn>
    </validation-observer>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data: () => ({
    error: null,
    password: '',
    passwordConfirmation: ''
  }),
  methods: {
    ...mapActions('auth', ['resetPassword']),
    submit() {
      const token = this.$route.params.token;
      return this.resetPassword({ password: this.password, token })
        .then(() => this.$router.push('/'))
        .catch(() => (this.error = 'An error has occurred!'));
    }
  }
};
</script>
