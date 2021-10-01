<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="3">
        <v-card
            color="primary"
            dark
            outlined
            class="pa-2"
            :to="{name: 'products-categories'}"
          >
            <p>
              <v-icon class="mr-1">mdi-cog</v-icon>Product Category</p>
          </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card
            color="primary"
            dark
            outlined
            class="pa-2"
            :to="{name: 'products'}"
          >
            <p>
              <v-icon class="mr-1">mdi-cog</v-icon>Products</p>
          </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card
            color="primary"
            dark
            outlined
            class="pa-2"
            :to="{name: 'roles'}"
          >
            <p>
              <v-icon class="mr-1">mdi-cog</v-icon>Roles</p>
          </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  middleware: ['auth'],
}
</script>

<style>

</style>