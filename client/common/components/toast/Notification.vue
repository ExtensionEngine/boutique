<template>
  <vue-snotify class="toast-notification"></vue-snotify>
</template>

<script>
const snotifyConfig = {
  timeout: 3000,
  showProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  position: 'centerCenter',
  backdrop: 0.15,
  icon: false
};

const generateHtmlTemplate = (msg, icon) => {
  return `
    <div class="message">
      <p>${msg}</p>
      <span class="icon is-medium mdi mdi-36px mdi-${icon}"/>
    </div>
  `;
};

const generateToastConfig = (
  config,
  { success, error } = { success: 'success', error: 'error' }
) => {
  const successConfig = {
    title: '',
    body: success,
    config: {
      ...config,
      html: generateHtmlTemplate(success, 'checkbox-marked-circle-outline')
    }
  };
  const errorConfig = {
    title: '',
    body: error,
    config: {
      ...config,
      timeout: 0,
      html: generateHtmlTemplate(error, 'close-circle-outline')
    }
  };
  return [() => successConfig, () => Promise.reject(errorConfig)];
};

export default {
  name: 'toast-notification',
  methods: {
    showToastAsync(loadingMsg, callback, successMsg, errorMsg) {
      this.$snotify.async(
        loadingMsg,
        '',
        () => callback()
          .then(...generateToastConfig(
            snotifyConfig,
            { success: successMsg, error: errorMsg }
          )),
        snotifyConfig
      );
    }
  }
};
</script>

<style lang="scss" scoped>
$notificationText: #f7f7f7;
$success: #0ce889;
$error: #d13d00;

.toast-notification /deep/ {
  .snotify {
    min-width: 400px;

    &Toast__inner {
      padding: 5px 15px;
      color: $notificationText;

      .message {
        display: flex;
        width: 100%;
        align-self: center;
        justify-content: space-between;
        background: none;

        p {
          flex: 1;
          text-align: center;
        }

        .icon {
          display: table-cell;
          vertical-align: middle;
        }
      }
    }

    &-success {
      background: $success;
    }

    &-error {
      background: $error;
    }
  }
}
</style>
