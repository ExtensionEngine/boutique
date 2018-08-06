<template>
  <div>
    <div class="profile-greeting">
      Welcome, 
      <span class="full-name">{{ user.firstName }} {{ user.lastName }}</span>. 
      You can modify your data using the following forms:
    </div>
    <div class="forms">
      <form
        @submit.prevent="submit"
        class="profile-form-data">
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
      <form
        @submit.prevent="uploadImage"
        class="profile-form-avatar">
        <v-image
          @imageReady="value => { imageReadyForUpload = value; }"
          ref="imageField"
          name="avatar"
          :imageWidth="200"
          :imageHeight="200"
          :fileOutputType="imageOutputMimeType"
          :placeholderImage="{url: user.avatar, show: !imageReadyForUpload}"
          :fileSelectionButton="fileSelectionButtonParameters"
          sizeLimit="220 kB">
        </v-image>
        <div class="btn-container">
          <div v-if="imageReadyForUpload">
            <button
              @click="imageReadyForUpload=false"
              type="button"
              class="button is-primary is-outlined">
              Cancel
            </button>
            <button
              type="submit"
              class="button is-primary">
              Submit
            </button>
          </div> 
          <button
            @click="openFileChooser"
            v-if="!imageReadyForUpload"
            type="button"
            class="button is-primary is-outlined">
            Upload New Image
          </button>
        </div>
      </form>
    </div>
    <toast-notification ref="toastMessage"></toast-notification>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { withValidation } from '@/common/validation';
import VInput from '@/common/components/form/VInput';
import VImage from '@/common/components/form/VImage';
import ToastNotification from '@/common/components/toast/Notification';

export default {
  name: 'user-profile',
  mixins: [withValidation()],
  data() {
    return {
      userData: {
        id: null,
        firstName: '',
        lastName: '',
        avatar: ''
      },
      imageReadyForUpload: false,
      imageOutputMimeType: 'image/png'
    };
  },
  computed: {
    ...mapState('auth', ['user']),
    isDirty() {
      return this.user.firstName !== this.userData.firstName ||
             this.user.lastName !== this.userData.lastName;
    },
    fileSelectionButtonParameters() {
      return {
        enable: this.imageReadyForUpload,
        text: this.imageReadyForUpload ? 'Choose...' : ''
      };
    }
  },
  methods: {
    ...mapActions('auth', ['updateUser']),
    ...mapActions('users', ['saveAvatar']),
    submit() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid || !this.isDirty) return;
        this.save(this.userData);
      });
    },
    save(user) {
      this.$refs.toastMessage.showToastAsync(
        'Submitting data...',
        () => this.updateUser(user),
        'Changes saved successfully!',
        'There was a problem updating your data. Please try again later.'
      );
    },
    openFileChooser() {
      this.$refs.imageField.openFileSelectionWindow();
    },
    uploadImage() {
      return this.$refs.imageField.toBlob()
        .then(blob => this.saveAvatar({
          blob: blob,
          userId: this.user.id,
          mimeType: this.imageOutputMimeType
        }))
        .then(res => {
          return (res.status !== 200)
            // eslint-disable-next-line prefer-promise-reject-errors
            ? Promise.reject()
            : Promise.resolve(res.data);
        })
        .then(avatarPath => {
          let tempUser = Object.assign({}, this.user);
          tempUser.avatar = avatarPath;
          return this.save(tempUser);
        })
      .then(() => setTimeout(() => {
        this.imageReadyForUpload = false;
        this.$refs.imageField.reset();
      }, 1000));
    }
  },
  watch: {
    user: {
      handler({ id, firstName, lastName, avatar }) {
        Object.assign(this.userData, { id, firstName, lastName, avatar });
      },
      immediate: true
    }
  },
  components: { VInput, VImage, ToastNotification }
};
</script>

<style lang="scss" scoped>
$userName: #00d1b2;

.profile-greeting {
  margin-bottom: 20px;
}

.full-name {
  color: $userName;
  font-weight: bold;
}

form .fields {
  width: 80%;
}

.forms {
  display: flex;
}

.profile-form {
  &-data {
    width: 65%;
  }

  &-avatar {
    width: 30%;
  }
}

.btn-container {
  text-align: center;

  .button {
    margin: 0 10px;
  }
}

</style>
