<template>
  <div>
    <div v-if="message" class="message">{{ message }}</div>
    <validation-observer v-slot="{ handleSubmit }" slim>
      <form @submit.prevent="handleSubmit(submit)">
        <validation-provider
          v-slot="{ errors }"
          name="Email"
          rules="required|email">
          <v-text-field
            v-model="email"
            :error-messages="errors"
            autocomplete="email"
            label="Email"
            outlined />
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="Password"
          rules="required">
          <v-text-field
            v-model="password"
            :error-messages="errors"
            autocomplete="current-password"
            type="password"
            label="Password"
            outlined />
        </validation-provider>
        <div class="options">
          <router-link :to="{ name: 'forgot-password' }">
            Forgot password ?
          </router-link>
          <v-btn type="submit" outlined>Login</v-btn>
        </div>
      </form>
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
  data() {
    return {
      email: '',
      password: '',
      message: ''
    };
  },
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
.options {
  padding: 5px 0 10px 0;
  text-align: right;

  a {
    display: inline-block;
    padding: 6px 20px;
    color: #444;
    text-decoration: none;
  }
}

.message {
  min-height: 16px;
  margin-bottom: 20px;
  color: #444;
  font-size: 16px;
  line-height: 16px;
}
</style>
