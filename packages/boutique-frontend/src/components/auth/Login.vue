<template>
  <div>
    <v-alert
      :value="!!localError"
      color="pink lighten-1"
      transition="fade-transition"
      dismissible text dense
      class="mb-7 text-left">
      {{ localError }}
    </v-alert>
    <validation-observer
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
          type="email"
          name="email"
          label="Email"
          placeholder="Email"
          autocomplete="username"
          prepend-inner-icon="mdi-email-outline"
          outlined
          class="required mb-1" />
      </validation-provider>
      <validation-provider
        v-slot="{ errors }"
        name="password"
        rules="required">
        <v-text-field
          v-model="password"
          :error-messages="errors"
          type="password"
          name="password"
          label="Password"
          placeholder="Password"
          prepend-inner-icon="mdi-lock-outline"
          autocomplete="current-password"
          outlined
          class="required" />
      </validation-provider>
      <div class="d-flex justify-end mt-1">
        <v-btn
          type="submit"
          color="blue-grey darken-4"
          block dark rounded depressed>
          Log in
        </v-btn>
      </div>
      <div class="options">
        <router-link :to="{ name: 'forgot-password' }">Forgot password?</router-link>
      </div>
    </validation-observer>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

const LOGIN_ERR_MESSAGE = 'The email or password you entered is incorrect.';

export default {
  name: 'user-login',
  data: () => ({
    email: '',
    password: '',
    localError: null
  }),
  methods: {
    ...mapActions('auth', ['login']),
    submit() {
      this.message = '';
      this.login({ email: this.email, password: this.password })
        .then(() => this.$router.push('/'))
        .catch(() => (this.localError = LOGIN_ERR_MESSAGE));
    }
  }
};
</script>

<style lang="scss" scoped>
.options {
  padding: 0.875rem 0 0.25rem;
  text-align: right;
}
</style>
