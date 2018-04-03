<template>
  <div>
    <div class="message">
      <span v-if="message">{{ message }}</span>
    </div>
    <form>
      <v-text-field
        v-model="email"
        label="E-mail"
        :error-messages="vErrors.collect('email')"
        v-validate="'required|email'"
        data-vv-name="email">
      </v-text-field>
      <v-text-field
        v-model="password"
        :error-messages="vErrors.collect('password')"
        v-validate="'required'"
        data-vv-name="password"
        label="Password"
        type="password">
      </v-text-field>
      <div class="options">
        <v-btn @click="submit">Login</v-btn>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { withValidation } from '@/common/validation';
import pick from 'lodash/pick';

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
  computed: mapState(['user']),
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
  }
};
</script>

<style lang="scss" scoped>
.options {
  padding: 5px 0 10px 0;
  text-align: right;
}
</style>
