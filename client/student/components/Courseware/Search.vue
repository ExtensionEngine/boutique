<template>
  <div class="columns is-centered">
    <div class="column is-4">
      <div :class="['control', 'has-icons-left', expanded ? 'expanded' : '']">
        <input
          :value="query"
          @input="updateQuery($event.target.value)"
          @focus="expanded = true"
          @blur="expanded = false"
          class="input"
          type="text"
          placeholder="Search...">
        <span class="icon is-left">
          <i v-show="!query" class="mdi mdi-24px mdi-magnify"/>
          <i
            v-show="query"
            @mousedown.prevent="updateQuery()"
            class="mdi mdi-24px mdi-close"/>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'search',
  props: {
    query: { type: String, required: true }
  },
  data() {
    return { expanded: false };
  },
  methods: {
    updateQuery(value = '') {
      this.$emit('update:query', value);
    }
  }
};
</script>

<style lang="scss" scoped>
.columns {
  margin-bottom: 25px;
}

.mdi-close {
  pointer-events: auto;
}

.control {
  width: 80%;
  margin: auto;
  transition: width 0.3s ease;
}

.expanded {
  width: 100%;
}
</style>
