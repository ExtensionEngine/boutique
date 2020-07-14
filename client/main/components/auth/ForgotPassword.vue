<template>
  <div>
    <div v-if="submitted">
      <v-alert color="#fddd57" class="text-center">
        <template v-if="!error">
          Email with password reset link sent.
          Please check your email and follow instructions to reset your password.
        </template>
        <template v-else-if="invalidEmail">
          We couldn't find account associated with
          <span class="font-weight-bold">{{ email }}</span>
        </template>
        <template v-else>
          Oops! Something went wrong.
        </template>
      </v-alert>
      <div class="options pt-10">
        <a @click="$router.go(-1)">Back</a>
      </div>
    </div>
    <div v-else>
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
          <div class="options">
            <a @click="$router.go(-1)">Back</a>
            <v-btn type="submit" outlined>Send reset email</v-btn>
          </div>
        </form>
      </validation-observer>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

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
  }
};
</script>

<style lang="scss" scoped>
.options {
  display: flex;
  justify-content: space-between;
  align-items: center;

  a {
    display: inline-block;
    color: #444;
    font-size: 14px;
  }
}
</style>
