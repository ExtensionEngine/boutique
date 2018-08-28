<template>
  <div>
    <div class="actions is-clearfix">
      <button
        @click="add"
        class="button is-primary is-pulled-right">
        Add
      </button>
    </div>
    <div v-if="!courses.length" class="notification is-warning">
      Click on the button above to enroll your first student.
    </div>
    <table v-else class="table is-fullwidth is-hoverable">
      <thead>
        <th>ID</th>
        <th>Name</th>
      </thead>
      <tbody>
        <tr v-for="it in courses" :key="it.id">
          <td>{{ it.id }}</td>
          <td>{{ it.name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

export default {
  name: 'content',
  data() {
    return {
      showModal: false,
      courses: [{
        id: 42,
        name: 'Example course: A'
      }, {
        id: 43,
        name: 'Example course: B'
      }]
    };
  },
  computed: {
    programLevelId() {
      return parseInt(this.$route.params.programLevelId);
    }
  },
  methods: {
    add() {
      this.showModal = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.notification {
  margin-top: 10px;
}
</style>
