<template>
  <div>
    <h1 class="title">
      {{ this.programLevel && this.programLevel.name }}
    </h1>
    <div class="tabs">
      <ul>
        <li class="is-active"><a>Enrollments</a></li>
        <li><a>Content</a></li>
      </ul>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import find from 'lodash/find';

export default {
  name: 'program-level',
  computed: {
    ...mapState('programLevels', { programLevels: 'items' }),
    id() {
      return parseInt(this.$route.params.programLevelId);
    },
    programLevel() {
      return find(this.programLevels, { id: this.id });
    }
  },
  methods: mapActions('programLevels', ['get']),
  created() {
    this.get(this.id.toString());
  }
};
</script>
