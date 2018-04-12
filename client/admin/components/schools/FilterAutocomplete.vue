<template>
  <div class="field">
    <multiselect
      label="name"
      track-by="id"
      v-model="selectedOption"
      :close-on-select="true"
      :clear-on-select="false"
      :options="options"
      :placeholder="placeholder"
      @open="fetchOptions"
      @select="filterItems">
    </multiselect>
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
