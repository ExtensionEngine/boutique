<template>
  <div>
    <div v-if="error" class="notification is-error">
      <span>{{ error }}</span>
    </div>
    <form @submit.prevent="submit">
      <v-input
        v-model="password"
        type="password"
        name="password"
        validate="required|alphanumerical|min:6">
      </v-input>
      <v-input
        v-model="passwordConfirmation"
        :validate="{ rules: { required: true, is: password } }"
        type="password"
        name="passwordConfirmation">
      </v-input>
      <button class="button" type="submit">
        Change password
      </button>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import VInput from '@/common/components/form/VInput';
import { withValidation } from '@/common/validation';

export default {
  mixins: [withValidation()],
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
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        return this.resetPassword({ password: this.password, token })
          .then(() => this.$router.push('/'))
          .catch(() => (this.error = 'An error has occurred!'));
      });
    }
  },
  components: { VInput }
};
</script>
