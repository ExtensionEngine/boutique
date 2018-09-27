<template>
  <div class="column is-4">
    <div @click="navigateTo" class="card">
      <div class="body">
        <div class="title">{{ name }}</div>
        <div class="description">{{ description }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import truncate from 'truncate';

export default {
  name: 'card',
  props: {
    content: { type: Object, required: true }
  },
  computed: {
    name() {
      return truncate(this.content.name, 75);
    },
    description() {
      return truncate(this.content.description, 180);
    },
    hasContent() {
      return !!this.content.container;
    }
  },
  methods: {
    navigateTo() {
      if (this.hasContent) {
        if (window.getSelection().toString()) return;
        const containerId = this.content.container.id;
        this.$router.push({
          name: 'container',
          params: { containerId }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  min-height: 300px;
  margin-top: 40px;
  padding: 30px 30px 20px;
  color: #363636;
  font-family: Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;
  border-radius: 3px;
  background-color: whitesmoke;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.54);
  transition: box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 10px 20px rgba(0,0,0,0.2), 0 8px 8px rgba(0,0,0,0.18);
  }

  .body {
    height: 220px;
    margin-bottom: 15px;
    overflow: hidden;

    @media (min-width: 1200px) and (max-width: 1300px) {
      height: 250px;
    }
  }
}

.title {
  height: 100px;
  margin: 20px 0 10px;
  font-size: 20px;
  font-weight: 300;
  line-height: 34px;
  text-align: left;

  @media (min-width: 1200px) and (max-width: 1300px) {
    height: 125px;
  }
}

.description {
  max-height: 130px;
  font-size: 14px;
  text-align: left;
}
</style>
