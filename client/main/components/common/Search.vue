<template>
  <div :class="{ expanded }" class="control has-icons-left">
    <input
      @input="setCoursewareFilter($event.target.value)"
      @focus="expanded = true"
      @blur="expanded = false"
      :value="coursewareFilter"
      class="input control-bar"
      type="text"
      placeholder="Search...">
    <span class="icon is-left control-bar">
      <span v-show="!coursewareFilter" class="mdi mdi-magnify"></span>
      <span
        v-show="coursewareFilter"
        @mousedown.prevent="setCoursewareFilter()"
        class="mdi mdi-close">
      </span>
    </span>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'navbar-search',
  data() {
    return { expanded: false };
  },
  computed: mapState('learner', ['coursewareFilter']),
  methods: mapMutations('learner', ['setCoursewareFilter'])
};
</script>

<style lang="scss" scoped>
.control {
  width: 75%;
  transition: all 0.5s;

  .control-bar {
    min-height: 3rem;
    color: #f5f5f5;
    background-color: #58b5f3;
    transition: all 0.5s;
  }

  .input {
    padding-left: 2.8rem !important;
    border: none;
  }

  ::placeholder {
    color: #f5f5f5 !important;
    transition: all 0.5s;
  }

  .icon {
    padding-left: 0.75rem;
    border-radius: 3px;

    .mdi {
      color: #f5f5f5;
      font-size: 1.5rem;
      transition: all 0.5s;
    }

    .mdi-close {
      pointer-events: auto;
    }
  }
}

.expanded {
  width: 100%;

  .control-bar {
    color: black;
    background-color: #f5f5f5;

    .mdi {
      color: #a9a9a9;
    }
  }

  ::placeholder {
    color: #a9a9a9 !important;
  }
}
</style>
