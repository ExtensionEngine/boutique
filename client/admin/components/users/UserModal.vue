<template>
  <modal :show="show" @close="close">
    <div class="user-modal">
      <h2 class="title is-4">{{ userData ? 'Edit' : 'Create' }} User</h2>
      <v-input
        v-model="user.email"
        :validate="{
          required: true,
          email: true,
          max: 255,
          'unique-email': userData
        }"
        name="email">
      </v-input>
      <v-select
        v-model="user.role"
        :options="roles"
        name="role"
        validate="required">
      </v-select>
      <v-input
        v-model="user.firstName"
        name="firstName"
        validate="required|alpha|min:2|max:50">
      </v-input>
      <v-input
        v-model="user.lastName"
        name="lastName"
        validate="required|alpha|min:2|max:50">
      </v-input>
      <div class="controls">
        <div class="is-pulled-right">
          <button @click="close" class="button">Cancel</button>
          <button @click="save" class="button is-primary">Save</button>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import { mapActions } from 'vuex';
import { role } from '@/../common/config';
import { withValidation } from '@/common/validation';
import cloneDeep from 'lodash/cloneDeep';
import humanize from 'humanize-string';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import Modal from '@/common/components/Modal';
import request from '@/common/api/request';
import VInput from '@/common/components/form/VInput';
import VSelect from '@/common/components/form/VSelect';

const resetUser = () => {
  return {
    firstName: '',
    lastName: '',
    email: '',
    role: null
  };
};

export default {
  name: 'user-modal',
  mixins: [withValidation()],
  props: {
    show: { type: Boolean, default: false },
    userData: { type: Object, default() { return {}; } }
  },
  data() {
    return { user: resetUser() };
  },
  computed: {
    roles() {
      return map(role, it => ({ label: humanize(it), value: it }));
    }
  },
  methods: {
    ...mapActions('users', { saveUser: 'save' }),
    close() {
      this.user = resetUser();
      this.$emit('close');
    },
    save() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        this.saveUser(this.user);
        this.close();
      });
    }
  },
  mounted() {
    if (this.$validator.rules['unique-email']) return;
    this.$validator.extend('unique-email', {
      getMessage: field => `The ${field} is not unique.`,
      validate: (email, [userData]) => {
        if (userData && email === userData.email) return true;
        return request.get('/users', { params: { email } })
          .then(res => ({ valid: isEmpty(res.data.data) }));
      }
    });
  },
  watch: {
    show(val) {
      if (!val) return;
      if (!isEmpty(this.userData)) this.user = cloneDeep(this.userData);
      this.vErrors.clear();
    }
  },
  components: { Modal, VInput, VSelect }
};
</script>

<style lang="scss" scoped>
.user-modal {
  padding: 20px 10px 40px;
}

.title {
  margin-bottom: 50px;
}

.controls {
  margin-top: 26px;

  .button {
    margin-left: 6px;
  }
}
</style>
