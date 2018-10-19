<template>
  <div>
    <div v-if="!courseware.length" class="container">
      <div class="notification is-warning has-text-centered">
        This Program doesn't have any courseware!
      </div>
    </div>
    <div v-else>
      <transition name="slide-fade">
        <div v-show="!filteredCourseware.length" class="container">
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
import { mapGetters, mapState } from 'vuex';
import ActivityCard from './ActivityCard';
import filter from 'lodash/filter';

const escapeSpecialChars = it => it.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

export default {
  name: 'courseware',
  props: {
    programId: { type: Number, required: true }
  },
  computed: {
    ...mapGetters('learner', ['courseware']),
    ...mapState('learner', ['coursewareFilter']),
    filteredCourseware() {
      const { courseware, coursewareFilter: filterBy } = this;
      if (!filterBy) return courseware;
      const testBy = new RegExp(escapeSpecialChars(filterBy.trim()), 'i');
      return filter(courseware, it => testBy.test(it.name));
    }
  },
  components: { ActivityCard }
};
</script>

<style lang="scss" scoped>

.container {
  display: flex;
  justify-content: center;

  .notification {
    margin-top: 0.6rem;
  }
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
  z-index: 0;
  transition: all 0.5s;
}

.slide-list-enter, .slide-list-leave-to {
  transform: translateY(18rem);
}

.slide-list-move {
  transition: all 0.5s;
}
</style>
