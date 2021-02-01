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
import { mapActions, mapState } from 'vuex';
import find from 'lodash/find';

export default {
  name: 'user-group-container',
  props: {
    userGroupId: { type: Number, required: true }
  },
  computed: {
    ...mapState('userGroups', { userGroups: 'items' }),
    userGroup: vm => find(vm.userGroups, { id: vm.userGroupId }),
    tabs: () => [
      { name: 'members', label: 'Members' },
      { name: 'userGroupSettings', label: 'Settings' }
    ],
    breadcrumbs: ({ userGroup }) => userGroup
      ? [
        { text: 'User groups', disabled: true },
        { text: userGroup.name, disabled: true }]
      : []
  },
  methods: mapActions('userGroups', ['get']),
  created() {
    this.get(this.userGroupId);
  }
};
</script>
