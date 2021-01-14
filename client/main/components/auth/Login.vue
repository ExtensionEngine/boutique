<template>
  <div>
    <div v-if="message" class="message">{{ message }}</div>
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
          name="email"
          label="Email"
          autocomplete="email"
          outlined />
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
          autocomplete="current-password"
          outlined />
      </validation-provider>
      <div class="options">
        <router-link :to="{ name: 'forgot-password' }">
          Forgot password ?
        </router-link>
        <v-btn type="submit" outlined>Login</v-btn>
      </div>
    </validation-observer>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { navigateTo } from '@/common/navigation';
import pick from 'lodash/pick';
import role from '@/../common/config/role';

const LOGIN_ERR_MESSAGE = 'User email and password do not match';

export default {
  name: 'login',
  data: () => ({
    email: '',
    password: '',
    message: ''
  }),
  methods: {
    ...mapActions('auth', ['login']),
    submit() {
      this.message = '';
      this.login(pick(this, ['email', 'password']))
        .then(user => {
          if (user.role === role.ADMIN) return navigateTo('/admin');
          this.$router.push('/');
        })
        .catch(() => (this.message = LOGIN_ERR_MESSAGE));
    }
  }
};
</script>

<style lang="scss" scoped>
$font-color: #444;

.options {
  padding: 0.3125rem 0 0.625rem 0;
  text-align: right;

  a {
    display: inline-block;
    padding: 0.375rem 1.25rem;
    color: $font-color;
    text-decoration: none;
  }
}

.message {
  min-height: 1rem;
  margin-bottom: 1.25rem;
  color: $font-color;
  font-size: 1rem;
  line-height: 1rem;
}
</style>
