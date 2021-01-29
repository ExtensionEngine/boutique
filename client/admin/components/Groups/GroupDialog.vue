<template>
  <admin-dialog v-model="show" header-icon="mdi-folder-plus-outline">
    <template v-slot:header>
      {{ groupData ? 'Edit' : 'Create' }} Group
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
          name="group name"
          rules="required|alpha|min:2|max:50">
          <v-text-field
            v-model="group.name"
            :error-messages="errors"
            label="Group Name"
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
import api from '@/admin/api/group';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

const resetGroup = () => ({ name: '' });

export default {
  name: 'group-dialog',
  props: {
    visible: { type: Boolean, default: false },
    groupData: { type: Object, default: () => ({}) }
  },
  data: () => ({
    group: resetGroup(),
    isLoading: false
  }),
  computed: {
    show: {
      get: vm => vm.visible,
      set(value) {
        if (!value) this.close();
      }
    },
    isNewGroup: vm => !vm.group.id
  },
  methods: {
    close() {
      this.group = resetGroup();
      this.$emit('update:visible', false);
    },
    async save() {
      const action = this.isNewGroup ? 'create' : 'update';
      await api[action](this.group);
      this.$emit(`${action}d`);
      this.close();
    }
  },
  watch: {
    show(val) {
      if (!val) return;
      if (!isEmpty(this.groupData)) this.group = cloneDeep(this.groupData);
    }
  },
  components: { AdminDialog }
};
</script>
