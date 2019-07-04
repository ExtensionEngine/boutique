<template>
  <v-dialog v-model="show" v-hotkey="{ esc: close }" width="700">
    <v-form @submit.prevent="save">
      <v-card class="pa-3">
        <v-card-title class="headline pr-0">
          <span>{{ userData ? 'Edit' : 'Create' }} User</span>
          <v-spacer/>
          <v-btn
            v-if="!isNewUser"
            @click="invite"
            :disabled="isLoading"
            :loading="isLoading"
            :outline="true"
            color="blue-grey">
            Reinvite
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="user.email"
            v-validate="{ required: true, email: true, 'unique-email': userData }"
            :error-messages="vErrors.collect('email')"
            label="E-mail"
            data-vv-name="email"
            class="mb-3"/>
          <v-select
            v-model="user.role"
            v-validate="'required'"
            @focus="focusTrap.pause()"
            @blur="focusTrap.unpause()"
            :items="roles"
            :error-messages="vErrors.collect('role')"
            label="Role"
            data-vv-name="role"
            class="mb-3"/>
          <v-text-field
            v-model="user.firstName"
            v-validate="'required|alpha|min:2|max:50'"
            :error-messages="vErrors.collect('firstName')"
            label="First Name"
            data-vv-name="firstName"
            class="mb-3"/>
          <v-text-field
            v-model="user.lastName"
            v-validate="'required|alpha|min:2|max:50'"
            :error-messages="vErrors.collect('lastName')"
            label="Last Name"
            data-vv-name="lastName"
            class="mb-3"/>
          <v-select
            v-model="user.groupName"
            @focus="focusTrap.pause()"
            @blur="focusTrap.unpause()"
            :items="groupNames"
            :error-messages="vErrors.collect('group')"
            label="Group"
            data-vv-name="group"
            class="mb-3"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="close">Cancel</v-btn>
          <v-btn color="success" type="submit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import api from '@/admin/api/user';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import groupApi from '@/admin/api/group';
import humanize from 'humanize-string';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import pick from 'lodash/pick';
import { role } from '@/../common/config';
import { withFocusTrap } from '@/common/focustrap';
import { withValidation } from '@/common/validation';

const el = vm => vm.$children[0].$refs.dialog;
const resetUser = () => {
  return {
    firstName: '',
    lastName: '',
    email: '',
    role: null,
    groupName: null,
    groupId: null
  };
};

export default {
  name: 'user-dialog',
  mixins: [withValidation(), withFocusTrap({ el })],
  props: {
    visible: { type: Boolean, default: false },
    userData: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      user: resetUser(),
      isLoading: false,
      groups: []
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
    },
    groupNames() {
      return map(this.groups, 'name');
    }
  },
  methods: {
    close() {
      this.user = resetUser();
      this.$emit('update:visible', false);
    },
    save() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        const action = this.isNewUser ? 'create' : 'update';
        if (this.user.groupName) {
          this.user.groupId = find(this.groups, group => {
            return group.name === this.user.groupName;
          })['id'];
        }
        api[action](this.user).then(() => this.$emit(`${action}d`));
        this.close();
      });
    },
    invite() {
      this.isLoading = true;
      api.invite(this.user).finally(() => (this.isLoading = false));
    },
    async getGroups() {
      let { items } = await groupApi.fetch();
      this.groups = map(items, item => pick(item, ['id', 'name']));
    }
  },
  watch: {
    show(val) {
      this.$nextTick(() => this.focusTrap.toggle(val));
      if (!val) return;
      this.vErrors.clear();
      if (!isEmpty(this.userData)) this.user = cloneDeep(this.userData);
    }
  },
  mounted() {
    this.getGroups();
    if (this.$validator.rules['unique-email']) return;
    this.$validator.extend('unique-email', {
      getMessage: field => `The ${field} is not unique.`,
      validate: (email, userData) => {
        if (userData && email === userData.email) return true;
        return api.fetch({ params: { email } })
          .then(({ total }) => ({ valid: !total }));
      }
    });
  }
};
</script>
