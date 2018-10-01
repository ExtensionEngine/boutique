<template>
  <div class="columns is-centered">
    <div class="column is-2">
      <table class="table is-fullwidth is-hoverable">
        <thead>
          <th>Id</th>
          <th>Student Id</th>
          <th>Cohort Id</th>
        </thead>
        <tbody>
          <tr v-for="it in programs" :key="it.id" @click="navigateTo(it)">
            <td>{{ it.id }}</td>
            <td>{{ it.studentId }}</td>
            <td>{{ it.cohortId }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'student-home',
  computed: {
    ...mapState('auth', ['user']),
    ...mapState('learner', ['programs'])
  },
  methods: {
    ...mapActions('learner', ['fetchPrograms', 'selectProgram', 'fetchSyllabus']),
    navigateTo(it) {
      this.selectProgram(it.cohortId);
      this.$router.push({ name: 'content' });
    }
  },
  created() {
    this.fetchPrograms(this.user.id);
  }
};
</script>

<style lang="scss">
</style>
