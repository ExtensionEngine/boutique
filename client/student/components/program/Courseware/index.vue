<template>
  <div>
    <div v-if="!courseware.length" class="columns is-centered">
      <div class="notification is-warning has-text-centered">
        This Program doesn't have any courseware!
      </div>
    </div>
    <div v-else>
      <transition name="empty-courseware">
        <div v-show="!filteredCourseware.length" class="columns is-centered">
          <div class="notification is-warning has-text-centered">
            No courseware found!
          </div>
        </div>
      </transition>
      <transition-group
        name="courseware"
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
  margin-top: 10px;
}

.courseware-enter-active {
  transition: all 0.5s;
}

.courseware-leave-active {
  position: absolute;
  transition: all 0.5s;
}

.courseware-enter, .courseware-leave-to {
  opacity: 0;
  transform: translateY(18rem);
}

.courseware-move {
  transition: all 0.5s;
}

.empty-courseware-enter-active, .empty-courseware-leave-active {
  transition: all 0.1s;
}

.empty-courseware-enter, .empty-courseware-leave-to {
  opacity: 0;
  transform: translateY(-10rem);
}
</style>
