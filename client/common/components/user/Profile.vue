<template>
  <div>
    <div class="profile-greeting">
      Welcome, 
      <span class="full-name">{{ user.firstName }} {{ user.lastName }}</span>. 
      You can modify your data using the following form:
    </div>
    <vue-snotify class="toast-notification"></vue-snotify>
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
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { withValidation } from '@/common/validation';
import VInput from '@/common/components/form/VInput';

const snotifyConfig = {
  timeout: 3000,
  showProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  position: 'centerCenter',
  backdrop: 0.15,
  icon: false
};

export default {
  name: 'user-profile',
  mixins: [withValidation()],
  data() {
    return {
      userData: {
        id: null,
        firstName: '',
        lastName: ''
      }
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
      this.$validator.validateAll().then(isValid => {
        if (!isValid || !this.isDirty) return;
        this.save(this.userData);
      });
    },
    save(user) {
      this.$snotify.async(
        'Submitting data...',
        '',
        () => this.updateUser(user)
          .then(...this.toast(
            snotifyConfig,
            {
              success: 'Changes saved successfully!',
              error: 'There was a problem updating your data. Please try again later.'
            }
          )),
        snotifyConfig
      );
    },
    toast(config, { success, error } = { success: 'success', error: 'error' }) {
      const successConfig = {
        title: '',
        body: success,
        config: {
          ...config,
          html: this.innerHtml(success, 'checkbox-marked-circle-outline')
        }
      };
      const errorConfig = {
        title: '',
        body: error,
        config: {
          ...config,
          timeout: 0,
          html: this.innerHtml(error, 'close-circle-outline')
        }
      };
      return [() => successConfig, () => Promise.reject(errorConfig)];
    },
    innerHtml(msg, icon) {
      return `
        <div class="message">
          <p>${msg}</p>
          <span class="icon is-medium mdi mdi-36px mdi-${icon}"/>
        </div>
      `;
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
$userName: #00d1b2;
$notificationText: #f7f7f7;
$success: #0ce889;
$error: #d13d00;

.profile-greeting {
  margin-bottom: 20px;
}

.full-name {
  color: $userName;
  font-weight: bold;
}

form .fields {
  width: 60%;
}

.toast-notification /deep/ {
  .snotify {
    min-width: 400px;

    &Toast__inner {
      padding: 5px 15px;
      color: $notificationText;

      .message {
        display: flex;
        width: 100%;
        align-self: center;
        justify-content: space-between;
        background: none;

        p {
          flex: 1;
          text-align: center;
        }

        .icon {
          display: table-cell;
          vertical-align: middle;
        }
      }
    }

    &-success {
      background: $success;
    }

    &-error {
      background: $error;
    }
  }
}
</style>
