<template>
  <div>
    <div class="message">
      <span v-if="message">{{ message }}</span>
    </div>
    <form @submit.prevent="submit">
      <v-input v-model="email" name="email" validate="required|email"></v-input>
      <v-input
        v-model="password"
        name="password"
        type="password"
        validate="required">
      </v-input>
      <div class="options">
        <router-link :to="{ name: 'forgot-password' }">
          Forgot password ?
        </router-link>
        <button class="button is-primary" type="submit">Login</button>
      </div>
    </form>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { withValidation } from '@/common/validation';
import pick from 'lodash/pick';
import VInput from '@/common/components/form/VInput';

const { mapActions } = createNamespacedHelpers('auth');
const LOGIN_ERR_MESSAGE = 'User email and password do not match';

export default {
  name: 'login',
  mixins: [withValidation()],
  data() {
    return {
      email: '',
      password: '',
      message: ''
    };
  },
  methods: {
    ...mapActions(['login']),
    submit() {
      this.message = '';
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        this.login(pick(this, ['email', 'password']))
          .then(() => this.$router.push('/'))
          .catch(() => (this.message = LOGIN_ERR_MESSAGE));
      });
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
  }
}
</style>
