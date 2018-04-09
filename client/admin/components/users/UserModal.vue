<template>
  <modal :show="show" @close="close">
    <v-input
      v-model="user.email"
      name="email"
      validate="required|email|max:255">
    </v-input>
    <v-select
      v-model="user.role"
      name="role"
      :options="roles">
    </v-select>
    <v-input
      v-model="user.firstName"
      name="firstName"
      validate="alpha|min:2|max:50">
    </v-input>
    <v-input
      v-model="user.lastName"
      name="lastName"
      validate="alpha|min:2|max:50">
    </v-input>
    <button @click="close" class="button">Cancel</button>
    <button @click="save" class="button is-success">Save</button>
  </modal>
</template>

<script>
import { mapActions } from 'vuex';
import { role } from '@/../common/config';
import { withValidation } from '@/common/validation';
import cloneDeep from 'lodash/cloneDeep';
import humanize from 'humanize-string';
import map from 'lodash/map';
import Modal from '@/common/components/Modal';
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
        this.saveUser({ ...this.user, role: this.user.role.value });
        this.close();
      });
    }
  },
  watch: {
    show(val) {
      if (!val) return;
      if (this.userData) this.user = cloneDeep(this.userData);
      this.vErrors.clear();
    }
  },
  components: { Modal, VInput, VSelect }
};
</script>
