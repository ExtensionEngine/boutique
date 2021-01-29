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
          <span>{{ groupData ? 'Edit' : 'Create' }} User</span>
        </v-card-title>
        <v-card-text>
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
import api from '@/admin/api/group';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

const resetGroup = () => ({
  name: ''
});

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
  }
};
</script>
