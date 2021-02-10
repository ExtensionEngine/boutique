<template>
  <v-container fluid>
    <div class="ml-10">
      <v-breadcrumbs :items="breadcrumbs" class="px-0" />
      <v-tabs color="primary" background-color="transparent">
        <v-tab
          v-for="({ name, label }) in tabs"
          :key="name"
          :to="{ name, params: { userGroupId } }"
          exact ripple>
          {{ label }}
        </v-tab>
      </v-tabs>
    </div>
    <router-view
      v-if="userGroup"
      :key="userGroupId"
      @created="fetch"
      :user-group="userGroup" />
  </v-container>
</template>

<script>
import api from '@/admin/api/userGroup';
import find from 'lodash/find';
import reverse from 'lodash/reverse';
import transform from 'lodash/transform';

export default {
  name: 'user-group-container',
  props: {
    userGroupId: { type: Number, required: true }
  },
  data: () => ({ userGroups: [] }),
  computed: {
    tabs: () => [
      { name: 'members', label: 'Members' },
      { name: 'subGroups', label: 'Sub Groups' },
      { name: 'userGroupSettings', label: 'Settings' }
    ],
    userGroup: vm => find(vm.userGroups, { id: vm.userGroupId }),
    breadcrumbItems() {
      const { userGroups, userGroup } = this;
      if (!userGroup) return [];
      const ancestors = transform(userGroups, (acc, _it) => {
        const parent = find(userGroups, { id: acc.currentGroup.parentId });
        if (!parent) return false;
        acc.items.push(parent);
        acc.currentGroup = parent;
      }, { items: [userGroup], currentGroup: userGroup });
      return reverse(ancestors.items).map(({ id, name }) => {
        const params = { userGroupId: id };
        return { text: name, to: { params } };
      });
    },
    breadcrumbs: vm => [{ text: 'User groups', disabled: true }, ...vm.breadcrumbItems]
  },
  methods: {
    async fetch() {
      const params = { fetchAll: true };
      const { items } = await api.fetch({ params });
      this.userGroups = items;
    }
  },
  created() {
    this.fetch();
  }
};
</script>
