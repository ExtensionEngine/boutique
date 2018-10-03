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
export default {
  name: 'activity-card',
  props: {
    activity: { type: Object, required: true }
  },
  computed: {
    contentContainers() {
      return this.activity.contentContainers;
    }
  },
  methods: {
    navigateTo() {
      this.$router.push({
        name: 'content-container',
        params: { containerId: this.activity.container.id }
      });
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
