<template>
  <div>
    <div v-if="error" class="notification is-error">
      <span>{{ error }}</span>
    </div>
    <form @submit.prevent="submit">
      <h2 class="title is-size-5">Change password</h2>
      <v-input
        v-model="oldPassword"
        autocomplete="current-password"
        name="currentPassword"
        type="password"
        validate="required">
      </v-input>
      <v-input
        v-model="password"
        autocomplete="new-password"
        type="password"
        name="newPassword"
        validate="required|alphanumerical|min:6">
      </v-input>
      <v-input
        v-model="passwordConfirmation"
        :validate="{ rules: { required: true, is: password } }"
        autocomplete="new-password"
        type="password"
        label="Retype new password"
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
      oldPassword: '',
      password: '',
      passwordConfirmation: ''
    };
  },
  methods: {
    ...mapActions('auth', ['changePassword', 'logout']),
    submit() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        const payload = {
          password: this.oldPassword,
          newPassword: this.password
        };
        return this.changePassword(payload)
          .then(() => this.logout())
          .catch(() => (this.error = 'An error has occurred!'));
      });
    }
  },
  components: { VInput }
};
</script>

<style lang="scss" scoped>
.title {
  margin-bottom: 1.75rem;
  font-weight: normal;
}
</style>
