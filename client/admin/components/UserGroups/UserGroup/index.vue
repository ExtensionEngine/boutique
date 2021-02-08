<template>
  <v-container fluid>
    <div class="ml-10">
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
      { name: 'userGroupSettings', label: 'Settings' }
    ]
  },
  async created() {
    this.userGroup = await api.get(this.userGroupId);
  }
};
</script>
