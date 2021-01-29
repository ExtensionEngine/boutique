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
          <span>{{ memberData ? 'Edit' : 'Add' }} Member</span>
        </v-card-title>
        <v-card-text>
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
  name: 'user-dialog',
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
      this.user = resetMember();
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
  components: { UserSelect }
};
</script>
