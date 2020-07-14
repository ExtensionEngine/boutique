<template>
  <div>
    <div v-if="error" class="notification is-error">
      <span>{{ error }}</span>
    </div>
    <validation-observer v-slot="{ handleSubmit }" slim>
      <form @submit.prevent="handleSubmit(submit)">
        <validation-provider
          v-slot="{ errors }"
          name="Password"
          rules="required|alphanumerical|min:6">
          <v-text-field
            v-model="password"
            :error-messages="errors"
            type="password"
            label="Password"
            outlined />
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="Password Confirmation"
          :rules="{ required: true, is: password }">
          <v-text-field
            v-model="passwordConfirmation"
            :error-messages="errors"
            type="password"
            label="Confirm Password"
            outlined />
        </validation-provider>
        <v-btn type="submit" outlined>
          Change password
        </v-btn>
      </form>
    </validation-observer>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      error: null,
      password: '',
      passwordConfirmation: ''
    };
  },
  methods: {
    ...mapActions('auth', ['resetPassword']),
    submit() {
      const token = this.$route.params.token;
      return this.resetPassword({ password: this.password, token })
        .then(() => this.$router.push('/'))
        .catch(() => (this.error = 'An error has occurred!'));
    }
  }
};
</script>
