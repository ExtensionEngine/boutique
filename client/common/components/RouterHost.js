export default {
  render() {
    if (this.routerReady) return getVNode(this.$slots.default);
  },
  data: () => ({ routerReady: false }),
  created() {
    const cb = () => (this.routerReady = true);
    this.$router.onReady(cb, cb);
  }
};

function getVNode(input) {
  if (!Array.isArray(input)) return input;
  if (input.length === 1) return input[0];
  return input;
}
