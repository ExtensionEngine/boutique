<template>
  <div :class="{ expanded }" class="control has-icons-left">
    <input
      :value="coursewareFilter"
      @input="setCoursewareFilter($event.target.value)"
      @focus="expanded = true"
      @blur="expanded = false"
      class="input"
      type="text"
      placeholder="Search...">
    <span class="icon is-left">
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
  name: 'search',
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
}

.input, .icon {
  min-height: 3rem;
  color: whitesmoke;
  background-color: #58b5f3;
  transition: all 0.5s;
}

.input {
  padding-left: 2.8rem !important;
  border: none;
}

.icon {
  padding-left: 0.75rem;
  border-radius: 3px;
}

.mdi {
  color: whitesmoke;
  font-size: 1.5rem;
  transition: all 0.5s;
}

.mdi-close {
  pointer-events: auto;
}

::placeholder {
  color: whitesmoke !important;
  transition: all 0.5s;
}

.expanded {
  width: 100%;

  .input, .icon {
    color: black;
    background-color: whitesmoke;
  }

  .mdi {
    color: darkgrey;
  }

  ::placeholder {
    color: darkgrey !important;
  }
}
</style>
