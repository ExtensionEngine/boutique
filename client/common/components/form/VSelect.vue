<template>
  <div class="field">
    <label class="label">{{ label }}</label>
    <div class="control">
      <multiselect
        :value="value"
        v-bind="options"
        @input="val => $emit('input', val)"
        @close="close"
        @open="open">
      </multiselect>
    </div>
  </div>
</template>

<script>
import humanize from 'humanize-string';
import Multiselect from 'vue-multiselect';

export default {
  name: 'v-select',
  inheritAttrs: true,
  props: ['value', 'name'],
  computed: {
    options() {
      return Object.assign({
        closeOnSelect: true,
        showLabels: false,
        placeholder: 'Select option',
        trackBy: 'name',
        label: 'label'
      }, this.$attrs);
    },
    label() {
      return humanize(this.name);
    }
  },
  methods: {
    open(val, id) {
      this.$emit('open', val, id);
    },
    close(id) {
      this.$emit('close', id);
    }
  },
  components: { Multiselect }
};
</script>

<style lang="scss">
@import '~vue-multiselect/dist/vue-multiselect.min';
</style>
