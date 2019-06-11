<template>
  <v-dialog v-model="show" v-hotkey="{ esc: close }" width="700">
    <v-form @submit.prevent="save">
      <v-card class="pa-3">
        <v-card-title class="headline pr-0">
          <span>{{ groupData ? 'Edit' : 'Create' }} Group</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="group.name"
            v-validate="'required|min:2|max:50'"
            :error-messages="vErrors.collect('name')"
            label="Group Name"
            data-vv-name="name"
            class="mb-3"/>
          <v-text-field
            v-model="group.description"
            v-validate="'required|min:2|max:255'"
            :error-messages="vErrors.collect('description')"
            label="Group Description"
            data-vv-name="description"
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
import api from '@/admin/api/group';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import { withFocusTrap } from '@/common/focustrap';
import { withValidation } from '@/common/validation';

const el = vm => vm.$children[0].$refs.dialog;
const resetGroup = () => {
  return {
    name: '',
    description: ''
  };
};

export default {
  name: 'group-dialog',
  mixins: [withValidation(), withFocusTrap({ el })],
  props: {
    visible: { type: Boolean, default: false },
    groupData: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      group: resetGroup(),
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
    isNewGroup() {
      return !this.group.id;
    }
  },
  methods: {
    close() {
      this.group = resetGroup();
      this.$emit('update:visible', false);
    },
    save() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        const action = this.isNewGroup ? 'create' : 'update';
        api[action](this.group).then(() => this.$emit(`${action}d`));
        this.close();
      });
    },
    invite() {
      this.isLoading = true;
      api.invite(this.group).finally(() => (this.isLoading = false));
    }
  },
  watch: {
    show(val) {
      this.$nextTick(() => this.focusTrap.toggle(val));
      if (!val) return;
      this.vErrors.clear();
      if (!isEmpty(this.groupData)) this.group = cloneDeep(this.groupData);
    }
  },
  mounted() {
    if (this.$validator.rules['unique-email']) return;
    this.$validator.extend('unique-email', {
      getMessage: field => `The ${field} is not unique.`,
      validate: (email, groupData) => {
        if (groupData && email === groupData.email) return true;
        return api.fetch({ params: { email } })
          .then(({ total }) => ({ valid: !total }));
      }
    });
  }
};
</script>
