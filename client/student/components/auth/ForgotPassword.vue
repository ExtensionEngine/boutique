<template>
  <div>
    <div v-if="message">
      <div class="notification is-warning">{{ message }}</div>
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
import { delay } from 'bluebird';
import { mapActions } from 'vuex';
import VInput from '@/common/components/form/VInput';

const messages = {
  emailSent: () => `Email with password reset link sent.
Please check your email and follow instructions to reset your password.`,
  invalidEmail: email => `We couldn't find account associated with ${email}.`,
  genericError: () => 'Oops! Something went wrong.'
};

export default {
  data() {
    return {
      email: '',
      message: null
    };
  },
  methods: {
    ...mapActions('auth', ['forgotPassword']),
    submit() {
      this.forgotPassword({ email: this.email })
        .then(() => {
          this.message = messages.emailSent();
          return delay(5000);
        })
        .then(() => this.$router.push('/'))
        .catch(err => {
          this.message = err.response.status === 404
            ? messages.invalidEmail(this.email)
            : messages.genericError();
        });
    }
  },
  components: { VInput }
};
</script>

<style lang="scss" scoped>
.well {
  font-size: 16px;
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
