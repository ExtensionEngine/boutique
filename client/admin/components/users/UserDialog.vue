<template>
  <v-dialog v-model="show" v-hotkey="{ esc: close }" width="700">
    <validation-observer
      v-if="show"
      ref="form"
      @submit.prevent="$refs.form.handleSubmit(save)"
      tag="form"
      novalidate>
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
            :rules="{ required: true, email: true, unique_email: userData }"
            name="email">
            <v-text-field
              v-model="user.email"
              :error-messages="errors"
              name="email"
              label="Email"
              class="mb-3" />
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="role"
            rules="required">
            <v-select
              v-model="user.role"
              :items="roles"
              :error-messages="errors"
              name="role"
              label="Role"
              class="mb-3" />
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="first name"
            rules="required|alpha|min:2|max:50">
            <v-text-field
              v-model="user.firstName"
              :error-messages="errors"
              label="First Name"
              class="mb-3" />
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="last name"
            rules="required|alpha|min:2|max:50">
            <v-text-field
              v-model="user.lastName"
              :error-messages="errors"
              label="Last Name"
              class="mb-3" />
          </validation-provider>
          <v-select
            v-model="user.groupName"
            :items="groupNames"
            :error-messages="vErrors.collect('group')"
            label="Group"
            data-vv-name="group"
            class="mb-3" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="close">Cancel</v-btn>
          <v-btn color="success" type="submit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </validation-observer>
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

const resetUser = () => ({
  firstName: '',
  lastName: '',
  email: '',
  role: null,
  groupName: null,
  groupId: null
});

export default {
  name: 'user-dialog',
  props: {
    visible: { type: Boolean, default: false },
    userData: { type: Object, default: () => ({}) }
  },
  data: () => ({
    user: resetUser(),
    isLoading: false,
    groups: []
  }),
  computed: {
    show: {
      get: vm => vm.visible,
      set(value) {
        if (!value) this.close();
      }
    },
    roles: vm => map(role, it => ({ text: humanize(it), value: it })),
    isNewUser: vm => vm.user.id,
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
      if (this.user.groupName) {
        this.user.groupId = find(this.groups, group => {
          return group.name === this.user.groupName;
        }).id;
      }
      const action = this.isNewUser ? 'create' : 'update';
      api[action](this.user).then(() => this.$emit(`${action}d`));
      this.close();
    },
    invite() {
      this.isLoading = true;
      api.invite(this.user).finally(() => (this.isLoading = false));
    },
    async getGroups() {
      const { items } = await groupApi.fetch();
      this.groups = map(items, item => pick(item, ['id', 'name']));
    }
  },
  watch: {
    show(val) {
      if (!val) return;
      if (!isEmpty(this.userData)) this.user = cloneDeep(this.userData);
    }
  }
};
</script>
