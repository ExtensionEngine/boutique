<template>
  <div>
    <v-card width="500" class="mx-auto">
      <div class="auth-header text-center py-10 px-2">
        <h1>
          <v-icon size="34" class="mr-1">mdi-shopping</v-icon>
          Boutique LMS
        </h1>
      </div>
      <div class="px-7 pt-10 pb-5">
        <router-view />
      </div>
    </v-card>
  </div>
</template>

<style lang="scss" scoped>
.auth-header {
  background: #ffc107;

  h1 {
    margin: 5px 0 3px 0;
    color: #444;
    font-size: 26px;
    font-weight: 300;

    .mdi {
      color: inherit;
    }
  }
}
</style>
