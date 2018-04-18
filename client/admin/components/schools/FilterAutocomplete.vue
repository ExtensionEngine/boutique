<template>
  <div class="field has-addons">
    <multiselect
      v-model="selectedOption"
      :clear-on-select="false"
      :close-on-select="true"
      :options="options"
      :placeholder="placeholder"
      @open="fetchOptions"
      @select="filterItems"
      class="control"
      label="name"
      track-by="id">
    </multiselect>
    <button
      v-if="selectedOption"
      @click="clearSelected"
      class="control">
      <span class="icon mdi mdi-restore"/>
    </button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Multiselect from 'vue-multiselect';

export default {
  name: 'filter-autocomplete',
  props: {
    placeholder: {
      type: String,
      default: 'Filter by District'
    }
  },
  data() {
    return {
      selectedOption: null
    };
  },
  computed: mapGetters('districts', { options: 'list' }),
  methods: {
    ...mapActions('schools', ['reset']),
    ...mapActions('districts', ['fetch']),
    clearSelected() {
      this.selectedOption = null;
      this.reset();
    },
    filterItems({ id }) {
      this.reset({ districtId: id });
    },
    fetchOptions() {
      if (this.options.length) return;
      this.fetch();
    }
  },
  components: {
    Multiselect
  }
};
</script>

<style lang="scss">
@import '~vue-multiselect/dist/vue-multiselect.min';
</style>
