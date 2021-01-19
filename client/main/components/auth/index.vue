<template>
  <div>
    <v-card width="500" class="mx-auto">
      <div class="auth-header">
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
  padding: 2.5rem 0.5rem;
  text-align: center;
  background: #ffc107;

  h1 {
    margin: 0.3125rem 0 0.1875rem 0;
    color: #444;
    font-size: 1.625rem;
    font-weight: 300;

    .mdi {
      color: inherit;
    }
  }
}
</style>
