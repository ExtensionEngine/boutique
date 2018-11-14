import createFocusTrap from 'focus-trap';

export const withFocusTrap = ({ watch, ...options } = {}) => ({
  created() {
    if (!watch) return;
    this.$watch(watch, state => this.$nextTick(() => {
      if (this.focusTrap) this.focusTrap.toggle(state);
    }));
  },
  mounted() {
    this.focusTrap = initFocusTrap(this, options);
    walk(this, vm => {
      vm.$on('focus', () => this.focusTrap.pause());
      vm.$on('blur', () => this.focusTrap.unpause());
    });
  },
  beforeDestroy() {
    this.focusTrap = null;
  }
});

function initFocusTrap(vm, options) {
  const { el: getElement = vm => vm.$el } = options;
  const el = getElement(vm);
  const config = { escapeDeactivates: false, ...options };
  const focusTrap = createFocusTrap(el, config);
  focusTrap.toggle = condition => {
    if (condition) focusTrap.activate();
    else focusTrap.deactivate();
  };
  return focusTrap;
}

function walk(vm, visitor) {
  vm.$children.forEach(it => walk(it, visitor));
  visitor(vm);
}
