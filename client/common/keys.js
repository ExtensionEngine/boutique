export { codes as keys } from 'keycode';

const castArray = arg => Array.isArray(arg) ? arg : [arg];
const isNumber = arg => typeof arg === 'number';
const getCode = e => isNumber(e.which) ? e.which : e.keyCode;

const keys = new (class {
  constructor() {
    Object.assign(this, {
      tracked: new Set(),
      _state: { active: {} }
    });
  }

  get state() {
    return this._state;
  }

  track(...keyCodes) {
    this.tracked = new Set([...this.tracked, ...keyCodes]);
  }

  isTracked(keyCode) {
    return this.tracked.has(keyCode);
  }

  toggle(keyCode, state = this.state.active[keyCode]) {
    if (!this.isTracked(keyCode)) return;
    this._state.active = { ...this._state.active, [keyCode]: state };
  }
})();

document.addEventListener('keydown', onKeydown);
document.addEventListener('keyup', onKeyup);

const mixin = (config = {}) => {
  const computed = Object.keys(config).reduce((acc, name) => {
    const keyCodes = castArray(config[name]);
    keys.track(...keyCodes);
    const isActive = vm => {
      return keyCodes.every(keyCode => Boolean(vm.$data.$keys.active[keyCode]));
    };
    return Object.assign(acc, { [name]: isActive });
  }, {});
  return {
    computed,
    data: () => ({ $keys: keys.state })
  };
};

export const withKeys = mixin;

function onKeydown(e) {
  const keyCode = getCode(e);
  keys.toggle(keyCode, true);
}

function onKeyup(e) {
  const keyCode = getCode(e);
  keys.toggle(keyCode, false);
}
