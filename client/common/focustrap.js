import createFocusTrap from 'focus-trap';

export const withFocusTrap = (options = {}) => ({
  mounted() {
    this.focusTrap = initFocusTrap(this, options);
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
