<template>
  <div class="field">
    <multiselect
      placeholder="Filter by District"
      label="name"
      track-by="id"
      v-model="district"
      :options="districts"
      :close-on-select="true"
      :clear-on-select="false"
      @open="fetchOptions"
      @select="filterSchools">
    </multiselect>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Multiselect from 'vue-multiselect';

export default {
  name: 'school-filter-autocomplete',
  data() {
    return {
      district: null
    };
  },
  computed: mapGetters('districts', { districts: 'array' }),
  methods: {
    ...mapActions('schools', { resetSchools: 'reset' }),
    ...mapActions('districts', { fetchDistricts: 'fetch' }),
    filterSchools({ id }) {
      this.resetSchools({ districtId: id });
    },
    fetchOptions() {
      if (this.districts.length) return;
      this.fetchDistricts();
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
