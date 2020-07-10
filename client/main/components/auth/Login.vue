<template>
  <div>
    <div class="message">
      <span v-if="message">{{ message }}</span>
    </div>
    <validation-observer v-slot="{ handleSubmit }" slim>
      <form @submit.prevent="handleSubmit(submit)">
        <validation-provider
          v-slot="{ errors }"
          name="Email"
          rules="required|email">
          <v-input
            v-model="email"
            :error="errors[0]"
            autocomplete="email"
            name="email" />
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="Password"
          rules="required">
          <v-input
            v-model="password"
            :error="errors[0]"
            autocomplete="current-password"
            name="password"
            type="password" />
        </validation-provider>
        <div class="options">
          <router-link :to="{ name: 'forgot-password' }">
            Forgot password ?
          </router-link>
          <button class="button" type="submit">Login</button>
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
import VInput from '@/common/components/form/VInput';

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
  },
  components: { VInput }
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
  }
}
</style>
