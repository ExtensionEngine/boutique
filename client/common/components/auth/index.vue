<template>
  <div class="auth-container">
    <div class="auth-panel">
      <div class="auth-header">
        <h1>LMS</h1>
      </div>
      <div class="auth-body">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.auth-container {
  padding-top: 7%;
}

.auth-panel {
  width: 500px;
  margin: auto;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);

  &:hover {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1), 0 2px 3px rgba(0,0,0,0.15);
  }

  h1 {
    margin: 5px 0 3px 0;
    color: white;
    font-size: 28px;
    font-weight: 300;
  }

  .auth-header {
    padding: 40px 10px;
    text-align: center;
    background: linear-gradient(90deg, #2979FF 60%, #3D5AFE);
  }

  .auth-body {
    padding: 40px 30px 20px;

    a {
      color: inherit;
      font-weight: 500;
    }
  }

  .message {
    min-height: 16px;
    margin-bottom: 20px;
    color: #da126d;
    font-size: 16px;
    line-height: 16px;
  }
}
</style>
