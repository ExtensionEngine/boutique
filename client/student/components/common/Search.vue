<template>
  <div :class="['control', 'has-icons-left', expanded ? 'expanded' : '']">
    <input
      :value="coursewareQuery"
      @input="setCoursewareQuery($event.target.value)"
      @focus="expanded = true"
      @blur="expanded = false"
      class="input"
      type="text"
      placeholder="Search...">
    <span class="icon is-left">
      <i v-show="!coursewareQuery" class="mdi mdi-24px mdi-magnify"/>
      <i
        v-show="coursewareQuery"
        @mousedown.prevent="setCoursewareQuery()"
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
  computed: mapState('learner', ['coursewareQuery']),
  methods: mapMutations('learner', ['setCoursewareQuery'])
};
</script>

<style lang="scss" scoped>
.control {
  width: 50%;
  transition: width 0.5s ease;
}

.input, .icon {
  min-height: 48px;
  color: whitesmoke;
  background-color: #58b5f3;
  transition: color 0.5s ease, background-color 0.5s ease;
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
  transition: color 0.5s ease;
}

.mdi-close {
  pointer-events: auto;
}

::-webkit-input-placeholder { /* Chrome/Opera/Safari */
  color: whitesmoke !important;
  transition: color 0.5s ease;
}

::-moz-placeholder { /* Firefox 19+ */
  color: whitesmoke !important;
  transition: color 0.5s ease;
}

:-ms-input-placeholder { /* IE 10+ */
  color: whitesmoke !important;
  transition: color 0.5s ease;
}

:-moz-placeholder { /* Firefox 18- */
  color: whitesmoke !important;
  transition: color 0.5s ease;
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
