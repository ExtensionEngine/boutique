<template>
  <admin-dialog v-model="show" header-icon="mdi-account-multiple-plus-outline">
    <template v-slot:header>
      {{ userGroupData ? 'Edit' : 'Create' }} User Group
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
          name="user group name"
          rules="required|min:2|max:50"
          outlined>
          <v-text-field
            v-model="userGroup.name"
            :error-messages="errors"
            label="User Group Name"
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
import api from '@/admin/api/userGroup';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

const resetUserGroup = () => ({ name: '' });

export default {
  name: 'user-group-dialog',
  props: {
    visible: { type: Boolean, default: false },
    userGroupData: { type: Object, default: () => ({}) }
  },
  data: () => ({
    userGroup: resetUserGroup(),
    isLoading: false
  }),
  computed: {
    show: {
      get: vm => vm.visible,
      set(value) {
        if (!value) this.close();
      }
    },
    isNewUserGroup: vm => !vm.userGroup.id
  },
  methods: {
    close() {
      this.userGroup = resetUserGroup();
      this.$emit('update:visible', false);
    },
    async save() {
      const action = this.isNewUserGroup ? 'create' : 'update';
      await api[action](this.userGroup);
      this.$emit(`${action}d`);
      this.close();
    }
  },
  watch: {
    show(val) {
      if (!val) return;
      const { userGroupData } = this;
      if (!isEmpty(userGroupData)) this.userGroup = cloneDeep(userGroupData);
    }
  },
  components: { AdminDialog }
};
</script>
