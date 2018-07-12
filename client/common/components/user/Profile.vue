<template>
  <div>
    <div class="profile-greeting">
      Welcome, 
      <span class="full-name">{{ user.firstName }} {{ user.lastName }}</span>. 
      You can modify your data using the following form:
    </div>
    <form @submit.prevent="submit">
      <div class="fields">
        <v-input
          v-model="userData.firstName"
          autocomplete="given-name"
          name="firstName"
          validate="required|alpha|min:2|max:50">
        </v-input>
        <v-input
          v-model="userData.lastName"
          autocomplete="family-name"
          name="lastName"
          validate="required|alpha|min:2|max:50">
        </v-input>
      </div>
      <button 
        :disabled="!isDirty" 
        class="btn-submit button is-primary"
        type="submit">
        Submit
      </button>
    </form>
    <transition name="fade">
      <span v-if="message" class="message">{{ message }}</span>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { withValidation } from '@/common/validation';
import VInput from '@/common/components/form/VInput';

export default {
  name: 'user-profile',
  mixins: [withValidation()],
  data() {
    return {
      userData: {
        id: null,
        firstName: '',
        lastName: ''
      },
      message: ''
    };
  },
  computed: {
    ...mapState('auth', ['user']),
    isDirty() {
      return this.user.firstName !== this.userData.firstName ||
             this.user.lastName !== this.userData.lastName;
    }
  },
  methods: {
    ...mapActions('auth', ['updateUser']),
    submit() {
      this.message = '';
      this.$validator.validateAll().then(isValid => {
        if (!isValid || !this.isDirty) return;
        this.save(this.userData);
      });
    },
    save(user) {
      this.updateUser(user)
        .then(() => (this.message = 'Changes saved successfully.'))
        .then(setTimeout(() => (this.message = ''), 2000))
        .catch(() => {
          this.message = `
            There was a problem updating your data. 
            Please try again later.
          `;
        });
    }
  },
  watch: {
    user: {
      handler({ id, firstName, lastName }) {
        Object.assign(this.userData, { id, firstName, lastName });
      },
      immediate: true
    }
  },
  components: { VInput }
};
</script>

<style lang="scss" scoped>
.profile-greeting {
  margin-bottom: 20px;
}
.full-name {
  color: #00d1b2;
  font-weight: bold;
}
.message {
  margin-left: 20px;
  font-style: italic;
  margin-left: 35px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
form {
  .fields {
    width: 100%;
    clear: both;
  }
  .btn-submit {
    float: left;
  }
}
</style>
