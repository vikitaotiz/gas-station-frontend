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
            :to="{name: 'bills'}"
          >
            <p>
              <v-icon class="mr-1">mdi-cog</v-icon>Bills</p>
          </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card
            color="primary"
            dark
            outlined
            class="pa-2"
            :to="{name: 'payments'}"
          >
            <p>
              <v-icon class="mr-1">mdi-cog</v-icon>Payment Modes</p>
          </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card
            color="primary"
            dark
            outlined
            class="pa-2"
            :to="{name: 'expenses-categories'}"
          >
            <p>
              <v-icon class="mr-1">mdi-cog</v-icon>Expense Categories</p>
          </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card
            color="primary"
            dark
            outlined
            class="pa-2"
            :to="{name: 'expenses'}"
          >
            <p>
              <v-icon class="mr-1">mdi-cog</v-icon>Expenses</p>
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