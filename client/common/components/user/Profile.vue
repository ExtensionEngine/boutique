<template>
  <div>
    <div v-if="user" id="profile-greeting">
      Welcome, <span class="user-full-name">{{ user.firstName }} {{ user.lastName }}</span>.
      You can modify your data using the following form:
    </div>
    <div>
      <form @submit.prevent="submit">
        <v-input
          v-model="firstName"
          autocomplete="given-name"
          name="firstName"
          validate="required|alpha|min:2|max:50">
        </v-input>
        <v-input
          v-model="lastName"
          autocomplete="family-name"
          name="lastName"
          validate="required|alpha|min:2|max:50">
        </v-input>
        <button class="button is-primary" type="submit">Submit</button>
        <transition name="fade">
          <span v-if="message" class="message">
            {{ message }}
          </span>
        </transition>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import VInput from '@/common/components/form/VInput';
import { withValidation } from '@/common/validation';

export default {
  name: 'user-profile',
  mixins: [withValidation()],
  data() {
    return {
      firstName: '',
      lastName: '',
      message: ''
    };
  },
  mounted() {
    if (this.user) {
      this.firstName = this.user.firstName;
      this.lastName = this.user.lastName;
    }
  },
  computed: mapState('auth', ['user']),
  methods: {
    ...mapActions('users', { saveUser: 'save' }),
    submit() {
      this.message = '';
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        if (this.firstOrLastNameChangeRequested()) {
          this.user.firstName = this.firstName;
          this.user.lastName = this.lastName;
          this.saveUser(this.user)
          .then(() => (this.message = 'Changes saved successfully.'))
          .then(setTimeout(() => (this.message = ''), 2000))
          .catch(() => (this.message = 'There was a problem updating your data. Please try again later.'));
        }
      });
    },
    firstOrLastNameChangeRequested() {
      return this.user.firstName !== this.firstName || this.user.lastName !== this.lastName;
    }
  },
  components: { VInput }
};
</script>

<style scoped>
#profile-greeting {
  margin-bottom: 20px;
}
.user-full-name {
  color: #00d1b2;
  font-weight: bold;
}
.message {
  margin-left: 20px;
  font-style: italic;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
