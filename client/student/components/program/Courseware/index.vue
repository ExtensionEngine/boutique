<template>
  <div>
    <div v-if="!courseware.length" class="columns is-centered">
      <div class="notification is-warning has-text-centered">
        This Program doesn't have any courseware!
      </div>
    </div>
    <div v-else>
      <transition name="slide-fade">
        <div v-show="!filteredCourseware.length" class="columns is-centered">
          <div class="notification is-warning has-text-centered">
            No courseware found!
          </div>
        </div>
      </transition>
      <transition-group
        name="slide-list"
        class="columns is-multiline"
        tag="div">
        <activity-card
          v-for="it in filteredCourseware"
          :key="it.id"
          :programId="programId"
          :activity="it"/>
      </transition-group>
    </div>
  </div>
</template>

<script>
import ActivityCard from './ActivityCard';
import { mapGetters } from 'vuex';

export default {
  name: 'courseware',
  props: {
    programId: { type: Number, required: true }
  },
  computed: mapGetters('learner', ['courseware', 'filteredCourseware']),
  components: { ActivityCard }
};
</script>

<style lang="scss" scoped>
.notification {
  margin-top: 0.6rem;
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.1s;
}

.slide-fade-enter, .slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10rem);
}

.slide-list-enter-active {
  transition: all 0.5s;
}

.slide-list-leave-active {
  position: absolute;
  transition: all 0.5s;
}

.slide-list-enter, .slide-list-leave-to {
  transform: translateY(18rem);
}

.slide-list-move {
  transition: all 0.5s;
}
</style>
