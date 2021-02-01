<template>
  <admin-dialog v-model="show" header-icon="mdi-account-plus-outline">
    <template v-slot:header>
      {{ memberData ? 'Edit' : 'Add' }} Member
    </template>
    <template v-slot:body>
      <validation-observer
        v-if="show"
        ref="form"
        @submit.prevent="$refs.form.handleSubmit(save)"
        tag="form"
        novalidate>
        <validation-provider
          v-slot="{ errors }"
          name="role"
          rules="required">
          <v-select
            v-model="member.role"
            :items="roles"
            :error-messages="errors"
            name="role"
            label="Role"
            outlined
            class="mb-3" />
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="user"
          rules="required">
          <user-select
            v-model="member.user"
            :params="{ userIds }"
            :error-messages="errors"
            label="User"
            outlined
            class="mb-3" />
        </validation-provider>
        <div class="d-flex justify-end mb-2">
          <v-btn @click="close" text>Cancel</v-btn>
          <v-btn type="submit" text>Save</v-btn>
        </div>
      </validation-observer>
    </template>
  </admin-dialog>
</template>

<script>
import AdminDialog from '@/admin/components/common/Dialog';
import api from '@/admin/api/userGroupMember';
import cloneDeep from 'lodash/cloneDeep';
import humanize from 'humanize-string';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { Role } from '@/../common/config';
import UserSelect from '../../../common/UserSelect';

const resetMember = () => ({
  user: null,
  role: null
});

export default {
  name: 'member-dialog',
  props: {
    visible: { type: Boolean, default: false },
    memberData: { type: Object, default: () => ({}) },
    userIds: { type: Array, default: () => [] },
    userGroupId: { type: Number, required: true }
  },
  data: () => ({
    member: resetMember(),
    isLoading: false
  }),
  computed: {
    show: {
      get: vm => vm.visible,
      set(value) {
        if (!value) this.close();
      }
    },
    roles: () => map(Role, it => ({ text: humanize(it), value: it })),
    isNewMember: vm => !vm.member.id
  },
  methods: {
    close() {
      this.member = resetMember();
      this.$emit('update:visible', false);
    },
    async save() {
      const { member, userGroupId, isNewMember } = this;
      const action = isNewMember ? 'create' : 'update';
      await api[action]({ ...member, userGroupId });
      this.$emit(`${action}d`);
      this.close();
    }
  },
  watch: {
    show(val) {
      if (!val) return;
      if (!isEmpty(this.memberData)) this.member = cloneDeep(this.memberData);
    }
  },
  components: { AdminDialog, UserSelect }
};
</script>
