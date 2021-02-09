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
    <router-view v-if="userGroup" :key="userGroupId" :user-group="userGroup" />
  </v-container>
</template>

<script>
import api from '@/admin/api/userGroup';

export default {
  name: 'user-group-container',
  props: {
    userGroupId: { type: Number, required: true }
  },
  data: () => ({ userGroup: null }),
  computed: {
    tabs: () => [
      { name: 'members', label: 'Members' },
      { name: 'subGroups', label: 'Sub Groups' },
      { name: 'userGroupSettings', label: 'Settings' }
    ],
    breadcrumbs() {
      if (!this.userGroup) return [];
      const { name, parent } = this.userGroup;
      return [
        { text: 'User groups', disabled: true },
        ...parent ? [{ text: parent.name, disabled: true }] : [],
        { text: name, disabled: true }
      ];
    }
  },
  watch: {
    userGroupId: {
      immediate: true,
      async handler(userGroupId) {
        this.userGroup = await api.get(userGroupId);
      }
    }
  }
};
</script>
