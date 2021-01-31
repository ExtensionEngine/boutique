<template>
  <div class="auth-container">
    <div class="auth-panel-container">
      <v-sheet elevation="0" rounded class="auth-panel">
        <div class="auth-header py-9">
          <div class="d-flex justify-center">
            <v-avatar size="72" color="primary" class="elevation-2">
              <v-icon size="40" color="secondary">mdi-school-outline</v-icon>
            </v-avatar>
          </div>
          <div class="d-flex justify-center">
            <h1 class="ma-3 headline">
              Tailor
              <span class="pa-1">|</span>
              <span class="subtitle-2">LMS starter</span>
            </h1>
          </div>
        </div>
        <div class="auth-body">
          <router-view />
        </div>
      </v-sheet>
    </div>
    <div class="waves-container">
      <waves height="15rem" color="31,58,84" slow />
    </div>
  </div>
</template>

<script>
import Waves from '@/main/components/common/Waves';

export default {
  components: { Waves }
};
</script>

<style lang="scss">
.auth-container {
  height: 100%;
}

.auth-container .auth-panel-container {
  position: relative;
  width: 26rem;
  min-height: 41rem;
  margin: 4% auto;
}

.auth-container .auth-panel.v-sheet {
  position: absolute;
  width: 100%;
  background: rgba($color: #e1e1e1, $alpha: 0.3);
  border: 1px dashed #777;
  z-index: 1;

  .auth-header {
    padding-bottom: 0;
  }

  .auth-body {
    padding: 0.25rem 1.5rem 2rem;

    a {
      color: inherit;
      font-weight: 400;
    }
  }
}

.auth-container .waves-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 15rem;
}
</style>
