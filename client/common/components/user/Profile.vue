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
        class="button is-primary"
        type="submit">
        Submit
      </button>
    </form>
    <transition name="fade">
      <div
        v-show="message.content"
        class="message-container"
        :class="messageContainerClass">
        <span class="message">
          {{ message.content }}
          <span
            v-if="message.isError"
            class="icon-close icon is-small mdi mdi-18px mdi-close"
            @click="message.content=''"
            aria-hidden="true">
          </span>
        </span>
      </div>
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
      message: {
        content: '',
        isError: false
      }
    };
  },
  computed: {
    ...mapState('auth', ['user']),
    isDirty() {
      return this.user.firstName !== this.userData.firstName ||
             this.user.lastName !== this.userData.lastName;
    },
    messageContainerClass() {
      return this.message.isError ? 'message-error' : 'message-notice';
    }
  },
  methods: {
    ...mapActions('auth', ['updateUser']),
    submit() {
      this.message.content = '';
      this.$validator.validateAll().then(isValid => {
        if (!isValid || !this.isDirty) return;
        this.save(this.userData);
      });
    },
    save(user) {
      this.updateUser(user)
        .then(() => {
          this.message.content = 'Changes saved successfully.';
          this.message.isError = false;
        })
        .then(setTimeout(() => (this.message.content = ''), 3000))
        .catch(() => {
          this.message.content = `
            There was a problem updating your data. 
            Please try again later.
          `;
          this.message.isError = true;
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
$messageText: #f7f7f7;
$messageError: #d13d00;
$messageNotice: #0ce889;

.profile-greeting {
  margin-bottom: 20px;
}

.full-name {
  color: #00d1b2;
  font-weight: bold;
}

.message {
  color: $messageText;
  background: transparent;

  &-container {
    display: inline-block;
    position: absolute;
    top: 30%;
    left: 20%;
    z-index: 50;
    width: 60%;
    margin-left: 35px;
    border-radius: 5px;
    padding: 20px 40px;
    text-align: center;
  }

  &-error {
    background: $messageError;
  }

  &-notice {
    background: $messageNotice;
  }
}

.icon-close {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px;
  cursor: pointer;
}

.fade-enter-active {
  transition: opacity 2s;
}

.fade-enter {
  opacity: 0;
}

form {
  .fields {
    width: 60%;
  }
}
</style>
