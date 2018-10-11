<template>
  <div :class="['control', 'has-icons-left', expanded ? 'expanded' : '']">
    <input
      :value="coursewareFilter"
      @input="setCoursewareFilter($event.target.value)"
      @focus="expanded = true"
      @blur="expanded = false"
      class="input"
      type="text"
      placeholder="Search...">
    <span class="icon is-left">
      <i v-show="!coursewareFilter" class="mdi mdi-24px mdi-magnify"/>
      <i
        v-show="coursewareFilter"
        @mousedown.prevent="setCoursewareFilter()"
        class="mdi mdi-24px mdi-close"/>
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
  min-height: 48px;
  color: whitesmoke;
  background-color: #58b5f3;
  transition: all 0.5s;
}

.input {
  padding-left: 45px !important;
  border: none;
}

.icon {
  padding-left: 10px;
  border-radius: 3px;
}

.mdi {
  color: whitesmoke;
  transition: all 0.5s;
}

.mdi-close {
  pointer-events: auto;
}

::-webkit-input-placeholder { /* Chrome/Opera/Safari */
  color: whitesmoke !important;
  transition: all 0.5s;
}

::-moz-placeholder { /* Firefox 19+ */
  color: whitesmoke !important;
  transition: all 0.5s;
}

:-ms-input-placeholder { /* IE 10+ */
  color: whitesmoke !important;
  transition: all 0.5s;
}

:-moz-placeholder { /* Firefox 18- */
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

  ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
    color: darkgrey !important;
  }

  ::-moz-placeholder { /* Firefox 19+ */
    color: darkgrey !important;
  }

  :-ms-input-placeholder { /* IE 10+ */
    color: darkgrey !important;
  }

  :-moz-placeholder { /* Firefox 18- */
    color: darkgrey !important;
  }
}
</style>
