<template>
  <v-card @click="navigateTo(activity)">
    <v-card-title>{{ activity.name | truncate(75) }}</v-card-title>
    <v-card-subtitle>{{ activity.description | truncate(180) }}</v-card-subtitle>
    <v-card-text>
      <ul class="pl-0">
        <li
          v-for="{ id } in activity.subActivities"
          :key="id"
          class="d-inline-block pr-2">
          <a @click.prevent.stop="navigateTo(it)" class="status"></a>
        </li>
      </ul>
    </v-card-text>
  </v-card>
</template>

<script>
import head from 'lodash/head';

export default {
  name: 'activity-card',
  props: {
    programId: { type: Number, required: true },
    activity: { type: Object, required: true }
  },
  methods: {
    navigateTo(activity) {
      const target = head(activity.subActivities) || activity;
      const { id, repositoryId, contentContainers } = target;
      const params = {
        programId: this.programId,
        repositoryId,
        activityId: id,
        containerId: head(contentContainers).id
      };
      this.$router.push({ name: 'activity', params });
    }
  }
};
</script>

<style lang="scss" scoped>
.v-card {
  min-height: 14rem;
  cursor: pointer;
}

.status {
  $size: 1.8rem;
  $background-color: #fdd835;

  display: block;
  width: $size;
  height: $size;
  background-color: $background-color;
  border-radius: 50%;
  transition: all 1s cubic-bezier(0.25,0.8,0.25,1);

  &:hover {
    background-color: darken($background-color, 15);
  }
}
</style>
