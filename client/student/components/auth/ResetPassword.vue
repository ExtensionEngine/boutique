<template>
  <div>
    <div v-if="error" class="notification is-error">
      <span>{{ error }}</span>
    </div>
    <form v-if="profile" @submit.prevent="submit">
      <h2 class="title is-size-5">
        Reset password for <span class="email">{{ profile.email }}</span>
      </h2>
      <v-input
        v-model="password"
        autocomplete="new-password"
        type="password"
        name="password"
        validate="required|alphanumerical|min:6">
      </v-input>
      <v-input
        v-model="passwordConfirmation"
        :validate="{ rules: { required: true, is: password } }"
        autocomplete="new-password"
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
import api from '@/admin/api/user';
import { mapActions } from 'vuex';
import VInput from '@/common/components/form/VInput';
import { withValidation } from '@/common/validation';

export default {
  mixins: [withValidation()],
  data() {
    return {
      error: null,
      password: '',
      passwordConfirmation: '',
      profile: null,
      token: null
    };
  },
  methods: {
    ...mapActions('auth', ['resetPassword']),
    setData(profile, token) {
      this.profile = profile;
      this.token = token;
    },
    submit() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        return this.resetPassword({ password: this.password, token: this.token })
          .then(() => this.$router.push('/'))
          .catch(() => (this.error = 'An error has occurred!'));
      });
    }
  },
  beforeRouteEnter({ params }, from, next) {
    api.getProfile(params.token).then(profile => {
      next(vm => vm.setData(profile, params.token));
    });
  },
  beforeRouteUpdate({ params }, from, next) {
    this.profile = null;
    api.getProfile(params.token).then(profile => {
      this.setData(profile, params.token);
      next();
    });
  },
  components: { VInput }
};
</script>

<style lang="scss" scoped>
$accent: #ffc107;

.title {
  margin-bottom: 1.75rem;
  font-weight: normal;
}

.email {
  color: darken($accent, 10%);
  font-weight: 500;
}
</style>
