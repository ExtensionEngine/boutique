<template>
  <admin-dialog v-model="isVisible" header-icon="mdi-account-multiple-plus-outline">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" text>
        <v-icon dense class="mr-1">mdi-plus</v-icon>
        Add user group
      </v-btn>
    </template>
    <template v-slot:header>Add user group</template>
    <template v-slot:body>
      <validation-observer
        v-if="isVisible"
        ref="form"
        v-slot="{ invalid }"
        @submit.prevent="$refs.form.handleSubmit(add)"
        tag="form"
        novalidate>
        <validation-provider
          v-slot="{ errors }"
          :rules="{ required: true }"
          name="learner">
          <v-autocomplete
            v-model="userGroupId"
            :items="userGroups"
            :error-messages="errors"
            :search-input.sync="name"
            :loading="isLoading"
            name="User group"
            label="User Group"
            placeholder="Start typing to Search"
            prepend-icon="mdi-magnify"
            clearable />
        </validation-provider>
        <div class="d-flex justify-end">
          <v-btn @click="close" text>Cancel</v-btn>
          <v-btn :disabled="invalid" type="submit" text>Add</v-btn>
        </div>
      </validation-observer>
    </template>
  </admin-dialog>
</template>

<script>
import AdminDialog from '@/admin/components/common/Dialog';
import map from 'lodash/map';
import offeringUserGroupApi from '@/admin/api/offeringUserGroup';
import pick from 'lodash/pick';
import userGroupApi from '@/admin/api/userGroup';

export default {
  name: 'user-group-dialog',
  props: {
    offeringId: { type: Number, required: true }
  },
  data: () => ({
    isVisible: false,
    name: null,
    userGroupId: null,
    userGroups: [],
    isLoading: false
  }),
  methods: {
    async add() {
      const params = pick(this, ['userGroupId', 'offeringId']);
      await offeringUserGroupApi.create(params);
      this.close();
      this.$emit('added');
    },
    close() {
      this.isVisible = false;
      this.userGroupId = null;
    },
    setUserGroups({ items: userGroups }) {
      this.userGroups = map(userGroups, ({ id, name }) => ({ value: id, text: name }));
    },
    fetch(name) {
      if (this.userGroupId) return;
      this.isLoading = true;
      const params = { name, fetchAll: true, limit: 30 };
      return userGroupApi.fetch({ params })
        .then(this.setUserGroups)
        .finally(() => (this.isLoading = false));
    }
  },
  watch: {
    name(val) {
      if (val) this.fetch(val);
    },
    isVisible(val) {
      if (!val) return;
      this.fetch();
    }
  },
  components: { AdminDialog }
};
</script>
