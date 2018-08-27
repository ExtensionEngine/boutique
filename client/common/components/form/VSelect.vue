<template>
  <div class="field">
    <label class="label">{{ label }}</label>
    <div class="control">
      <multiselect
        v-validate="validate"
        :value="resolvedValue"
        :name="name"
        v-bind="options"
        @input="it => $emit('input', isValueObj ? (it && it.value) : it)"
        @close="close"
        @open="open"
        @search-change="val => $emit('search-change', val)"
        data-vv-delay="1000">
      </multiselect>
    </div>
    <p v-visible="showError" class="help is-danger">
      {{ vErrors.first(name) || '&nbsp;' }}
    </p>
  </div>
</template>

<script>
import find from 'lodash/find';
import first from 'lodash/first';
import humanize from 'humanize-string';
import isObject from 'lodash/isObject';
import Multiselect from 'vue-multiselect';

export default {
  name: 'v-select',
  inheritAttrs: true,
  props: {
    name: { type: String, required: true },
    value: { type: [String, Number], default: null },
    validate: { type: [String, Object], default: null }
  },
  computed: {
    options() {
      return Object.assign({
        closeOnSelect: true,
        showLabels: false,
        placeholder: 'Select option',
        trackBy: 'value',
        label: 'label'
      }, this.$attrs);
    },
    isValueObj() {
      const { options } = this.options;
      return isObject(first(options));
    },
    resolvedValue() {
      const { value } = this;
      if (!value || !this.isValueObj) return value;
      return find(this.options.options, { value });
    },
    label() {
      return humanize(this.name);
    },
    showError() {
      return this.vErrors.has(this.name);
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
  components: { Multiselect },
  inject: ['$validator']
};
</script>

<style lang="scss">
@import '~vue-multiselect/dist/vue-multiselect.min';
</style>
