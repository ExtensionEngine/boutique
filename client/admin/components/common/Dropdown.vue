<template>
  <div
    class="dropdown is-active"
    v-click-outside="() => { showMenu = false; }"
    @click="showMenu = !showMenu">
    <div class="dropdown-trigger">
      <button
        class="button dropdown-header is-transparent"
        aria-haspopup="true"
        aria-controls="dropdown-menu">
          <slot name="header">Options</slot>
          <span
            :class="`mdi-chevron-${ showMenu ? 'up' : 'down' }`"
            class="icon is-small mdi mdi-18px menu-chevron"
            aria-hidden="true">
          </span>
      </button>
    </div>
    <div
      id="dropdown-menu"
      class="dropdown-menu"
      role="menu"
      v-show="showMenu">
      <div class="dropdown-content">
        <slot name="menuItems"/>
      </div>
    </div>
  </div>
</template>

<script>
import { directive as clickOutside } from 'v-click-outside';

export default {
  data() {
    return { showMenu: false };
  },
  computed: {
    menuItems() {
      return this.$slots.menuItems[0];
    }
  },
  updated() {
    this.menuItems.children.forEach(({ elm }) => {
      if (elm.nodeType !== Node.ELEMENT_NODE) return;
      elm.classList.add('dropdown-item');
    });
  },
  directives: { clickOutside }
};
</script>

<style lang="scss" scoped>
$dropdownColor: #eee;

.menu-chevron {
  margin-right: 1px !important;
}

.dropdown {
  &-menu {
    min-width: 100%;
    cursor: pointer;
  }

  &-header {
    padding: 5px;
    color: #0ccce8;
    font-weight: 500;
  }

  &-content {
    background: $dropdownColor;
  }

  &-item:hover {
    color: #fff;
    font-weight: bold;
    background: rgba(50, 110, 130, 0.3);
  }
}

.is-transparent {
  background: transparent;
  background-image: none;
}
</style>
