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
          <v-input
            v-model="password"
            :error="errors[0]"
            type="password"
            name="password" />
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="Password Confirmation"
          :rules="{ required: true, is: password }">
          <v-input
            v-model="passwordConfirmation"
            :error="errors[0]"
            type="password"
            name="passwordConfirmation" />
        </validation-provider>
        <button class="button" type="submit">
          Change password
        </button>
      </form>
    </validation-observer>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import VInput from '@/common/components/form/VInput';

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
  },
  components: { VInput }
};
</script>
