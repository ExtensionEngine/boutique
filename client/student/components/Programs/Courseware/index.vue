<template>
  <div>
    <div v-if="!courseware.length" class="columns is-centered">
      <div class="notification is-warning has-text-centered">
        This Program doesn't have any courseware!
      </div>
    </div>
    <div v-else class="columns is-multiline">
      <activity-card
        v-for="it in courseware"
        :key="it.id"
        :programId="programId"
        :activity="it"/>
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
  computed: mapGetters('learner', ['courseware']),
  components: { ActivityCard }
};
</script>
