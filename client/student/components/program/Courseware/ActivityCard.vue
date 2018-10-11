<template>
  <div class="column is-4">
    <div @click="navigateTo(activity)" class="card">
      <div class="card-content">
        <h2 class="title">{{ activity.name | truncate(75) }}</h2>
        <p class="subtitle">{{ activity.description | truncate(180) }}</p>
        <ul class="sub-activities">
          <li v-for="it in activity.subActivities" :key="it.id">
            <a @click.prevent.stop="navigateTo(it)" class="status"></a>
          </li>
        </ul>
      </div>
    </div>
  </div>
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
.card {
  min-height: 18rem;
  margin: 1rem;
  padding: 0.25rem;
  background-color: #fff;
  border-radius: 2px;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: all 0.3s cubic-bezier(0.25,0.8,0.25,1);

  &:hover {
    box-shadow: 0 6px 12px rgba(0,0,0,0.25), 0 6px 6px rgba(0,0,0,0.22);
  }

  .title {
    color: #555;
    font-size: 1.5rem;
    font-weight: 300;
    letter-spacing: 1px;
  }

  .subtitle {
    min-height: 4rem;
    padding-top: 0.5rem;
    font-size: 1rem;
    font-weight: 300;
    letter-spacing: 1px;
  }
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

.sub-activities {
  li {
    display: inline-block;
    padding-right: 0.6rem;
  }
}
</style>
