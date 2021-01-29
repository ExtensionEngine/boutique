<template>
  <admin-dialog v-model="show" header-icon="mdi-folder-plus-outline">
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
            class="mb-3" />
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="user"
          rules="required">
          <user-select
            v-model="member.user"
            :error-messages="errors"
            label="User"
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
import api from '@/admin/api/user';
import cloneDeep from 'lodash/cloneDeep';
import humanize from 'humanize-string';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { role } from '@/../common/config';
import UserSelect from '../../common/UserSelect';

const resetMember = groupId => ({
  groupId,
  user: null,
  role: null
});

export default {
  name: 'member-dialog',
  props: {
    visible: { type: Boolean, default: false },
    memberData: { type: Object, default: () => ({}) },
    groupId: { type: Number, required: true }
  },
  data: ({ groupId }) => ({
    member: resetMember(groupId),
    isLoading: false
  }),
  computed: {
    show: {
      get: vm => vm.visible,
      set(value) {
        if (!value) this.close();
      }
    },
    roles: () => map(role, it => ({ text: humanize(it), value: it })),
    isNewMember: vm => vm.member.id
  },
  methods: {
    close() {
      this.member = resetMember();
      this.$emit('update:visible', false);
    },
    async save() {
      const action = this.isNewMember ? 'create' : 'update';
      await api[action](this.member);
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
