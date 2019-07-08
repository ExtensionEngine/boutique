<template>
  <div>
    <div v-if="submitted">
      <div class="notification is-warning">
        <template v-if="!error">
          Email with password reset link sent.
          Please check your email and follow instructions to reset your password.
        </template>
        <template v-else-if="invalidEmail">
          We couldn't find account associated with
          <span class="email">{{ email }}</span>
        </template>
        <template v-else>
          Oops! Something went wrong.
        </template>
      </div>
      <div class="options">
        <a @click="$router.go(-1)">Back</a>
      </div>
    </div>
    <div v-else>
      <form @submit.prevent="submit">
        <v-input v-model="email" name="email" validate="required|email"></v-input>
        <button type="submit" class="button">Send reset email</button>
        <div class="options">
          <a @click="$router.go(-1)">Back</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import VInput from '@/common/components/form/VInput';

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));

export default {
  data() {
    return {
      email: '',
      error: null,
      submitted: false
    };
  },
  computed: {
    invalidEmail() {
      return this.error && this.error.response.status === 404;
    }
  },
  methods: {
    ...mapActions('auth', ['forgotPassword']),
    submit() {
      this.submitted = false;
      this.forgotPassword({ email: this.email })
        .finally(() => (this.submitted = true))
        .then(() => delay(5000))
        .then(() => this.$router.push('/'))
        .catch(err => (this.error = err));
    }
  },
  components: { VInput }
};
</script>

<style lang="scss" scoped>
.well {
  font-size: 16px;
}

.notification .email {
  font-weight: bold;
}

.button {
  margin-top: 5px;
}

.options {
  padding: 10px 0;

  a {
    display: inline-block;
    color: #444;
    font-size: 14px;
  }
}
</style>
