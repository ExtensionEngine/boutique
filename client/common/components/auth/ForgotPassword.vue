<template>
  <div>
    <div v-if="message">
      <div class="notification is-warning">
        {{ message }}
      </div>
      <div class="options">
        <a @click="$router.go(-1)">Back</a>
      </div>
    </div>
    <div v-else>
      <form @submit.prevent="submit">
        <v-input v-model="email" name="email" validate="required|email"></v-input>
        <button type="submit" class="button is-primary">Send reset email</button>
        <div class="options">
          <a @click="$router.go(-1)">Back</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { delay } from 'bluebird';
import VInput from '@/common/components/form/VInput';

const { mapActions } = createNamespacedHelpers('auth');

export default {
  data() {
    return {
      email: '',
      message: null
    };
  },
  methods: {
    ...mapActions(['forgotPassword']),
    submit() {
      this.forgotPassword({ email: this.email })
        .then(() => {
          this.message = 'Reset email sent';
          return delay(2000);
        })
        .then(() => this.$router.push('/'))
        .catch(() => (this.message = 'Oops! Something went wrong.'));
    }
  },
  components: { VInput }
};
</script>


<style lang="scss" scoped>
.well {
  font-size: 16px;
}

.button {
  margin-top: 5px;
}

.options {
  padding: 10px 0;

  a {
    display: inline-block;
    font-size: 14px;
  }
}
</style>
