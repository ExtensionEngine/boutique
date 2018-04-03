<template>
  <div>
    <div class="message">
      <span v-if="message">{{ message }}</span>
    </div>
    <form>
      <div class="field">
        <label class="label">Email</label>
        <div class="control">
          <input
            v-model="email"
            v-validate="'required|email'"
            data-vv-name="email"
            class="input"
            placeholder="Email">
        </div>
        <p v-if="vErrors.has('email')" class="help is-danger">
          {{ vErrors.first('email') }}
        </p>
      </div>
      <div class="field">
        <label class="label">Password</label>
        <div class="control">
          <input
            v-model="password"
            v-validate="'required'"
            data-vv-name="password"
            class="input"
            type="password"
            placeholder="Password">
        </div>
        <p v-if="vErrors.has('password')" class="help is-danger">
          {{ vErrors.first('password') }}
        </p>
      </div>
      <div class="options">
        <button @click.stop="submit" class="button is-primary" type="button">
          Login
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
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
