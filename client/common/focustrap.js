import createFocusTrap from 'focus-trap';

export const withFocusTrap = (options = {}) => ({
  mounted() {
    const { el: getElement = vm => vm.$el } = options;
    const el = getElement(this);
    const config = { escapeDeactivates: false, ...options };
    const focusTrap = createFocusTrap(el, config);
    focusTrap.toggle = condition => {
      if (condition) focusTrap.activate();
      else focusTrap.deactivate();
    };
    this.focusTrap = focusTrap;
  },
  beforeDestroy() {
    this.focusTrap = null;
  }
});
