<template>
  <div class="auth-container">
    <div class="auth-panel">
      <div class="auth-header">
        <h1>
          <span class="mdi mdi-shopping"></span>
          <span class="has-text-weight-normal">Boutique</span>
          LMS
        </h1>
      </div>
      <div class="auth-body">
        <router-view/>
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
  box-shadow: 0 1px 3px rgba(0,0,0,0.22), 0 1px 2px rgba(0,0,0,0.34);
  transition: all 0.3s cubic-bezier(0.25,0.8,0.25,1);

  &:hover {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1), 0 2px 3px rgba(0,0,0,0.15);
  }

  h1 {
    margin: 5px 0 3px 0;
    color: #444;
    font-size: 26px;
    font-weight: 300;

    .mdi {
      margin-right: 5px;
      font-size: 34px;
    }
  }

  .auth-header {
    padding: 40px 10px;
    text-align: center;
    background: #ffc107;
  }

  .auth-body {
    padding: 40px 30px 20px;
  }

  .message {
    min-height: 16px;
    margin-bottom: 20px;
    color: #444;
    font-size: 16px;
    line-height: 16px;
  }
}
</style>
