<template>
  <div class="column is-4">
    <div @click="navigateTo" class="card">
      <div class="card-header">
        <div class="card-header-title">
          {{ activity.name | truncate(75) }}
        </div>
      </div>
      <div class="card-content">
        <div class="content">
          {{ activity.description | truncate(180) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import head from 'lodash/head';

export default {
  name: 'activity-card',
  props: {
    activity: { type: Object, required: true }
  },
  methods: {
    navigateTo() {
      const firstSubActivity = head(this.activity.subActivities) || this.activity;
      const { id, repositoryId, contentContainers } = firstSubActivity;
      const params = {
        repositoryId,
        activityId: id,
        containerId: head(contentContainers).id
      };
      this.$router.push({ name: 'content-container', params });
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  min-height: 300px;
  padding: 20px;
  color: #363636;
  border-radius: 3px;
  background-color: whitesmoke;
  cursor: pointer;
}
</style>
