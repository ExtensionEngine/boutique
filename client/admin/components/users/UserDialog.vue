<template>
  <v-dialog v-model="show" v-hotkey="{ esc: close }" width="700">
    <validation-observer v-if="show" v-slot="{ handleSubmit }" slim>
      <form @submit.prevent="handleSubmit(save)">
        <v-card class="pa-3">
          <v-card-title class="headline">
            <span>{{ userData ? 'Edit' : 'Create' }} User</span>
            <v-spacer />
            <v-btn
              v-if="!isNewUser"
              @click="invite"
              :disabled="isLoading"
              :loading="isLoading"
              outlined
              color="blue-grey">
              Reinvite
            </v-btn>
          </v-card-title>
          <v-card-text>
            <validation-provider
              v-slot="{ errors }"
              name="E-mail"
              :rules="{ required: true, email: true, unique_email: userData }">
              <v-text-field
                v-model="user.email"
                :error-messages="errors"
                label="E-mail"
                class="mb-3" />
            </validation-provider>
            <validation-provider
              v-slot="{ errors }"
              name="Role"
              rules="required">
              <v-select
                v-model="user.role"
                @focus="focusTrap.pause()"
                @blur="focusTrap.unpause()"
                :items="roles"
                :error-messages="errors"
                label="Role"
                class="mb-3" />
            </validation-provider>
            <validation-provider
              v-slot="{ errors }"
              name="First Name"
              rules="required|alpha|min:2|max:50">
              <v-text-field
                v-model="user.firstName"
                :error-messages="errors"
                label="First Name"
                class="mb-3" />
            </validation-provider>
            <validation-provider
              v-slot="{ errors }"
              name="Last Name"
              rules="required|alpha|min:2|max:50">
              <v-text-field
                v-model="user.lastName"
                :error-messages="errors"
                label="Last Name"
                class="mb-3" />
            </validation-provider>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="close">Cancel</v-btn>
            <v-btn color="success" type="submit">Save</v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </validation-observer>
  </v-dialog>
</template>

<script>
import api from '@/admin/api/user';
import cloneDeep from 'lodash/cloneDeep';
import humanize from 'humanize-string';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { role } from '@/../common/config';
import { withFocusTrap } from '@/common/focustrap';

const el = vm => vm.$children[0].$refs.dialog;
const resetUser = () => {
  return {
    firstName: '',
    lastName: '',
    email: '',
    role: null
  };
};

export default {
  name: 'user-dialog',
  mixins: [withFocusTrap({ el })],
  props: {
    visible: { type: Boolean, default: false },
    userData: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      user: resetUser(),
      isLoading: false
    };
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) this.close();
      }
    },
    roles() {
      return map(role, it => ({ text: humanize(it), value: it }));
    },
    isNewUser() {
      return !this.user.id;
    }
  },
  methods: {
    close() {
      this.user = resetUser();
      this.$emit('update:visible', false);
    },
    save() {
      const action = this.isNewUser ? 'create' : 'update';
      api[action](this.user).then(() => this.$emit(`${action}d`));
      this.close();
    },
    invite() {
      this.isLoading = true;
      api.invite(this.user).finally(() => (this.isLoading = false));
    }
  },
  watch: {
    show(val) {
      this.$nextTick(() => this.focusTrap.toggle(val));
      if (!val) return;
      if (!isEmpty(this.userData)) this.user = cloneDeep(this.userData);
    }
  }
};
</script>
