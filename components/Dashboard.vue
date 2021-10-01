<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12">
        <v-card
            tile
            color="primary"
            dark
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-chart-pie</v-icon>Today's Profit Margin
              <v-spacer></v-spacer>
              Ksh {{sales_today - expenses_today}}
            </v-card-title>
          </v-card>
      </v-col>
    </v-row>
    <h3>Sales Today</h3>
    <v-divider dark color="primary"></v-divider>
    <v-row class="mb-3">
      <v-col cols="12" md="3">
        <v-card
            elevation="0"
            color="success"
            dark
            :to="{name: 'sales'}"
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-chart-pie</v-icon> Total Sales
              <v-spacer></v-spacer>
              Ksh {{sales_today}}
            </v-card-title>
          </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card
            elevation="0"
            color="pink"
            dark
            :to="{name: 'sales'}"
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-chart-pie</v-icon>Cash
              <v-spacer></v-spacer>
              Ksh {{sales_today_cash}}
            </v-card-title>
          </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card
            elevation="0"
            color="orange"
            dark
            :to="{name: 'sales'}"
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-chart-pie</v-icon>Mpesa
              <v-spacer></v-spacer>
              Ksh {{sales_today_mpesa}}
            </v-card-title>
          </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card
            elevation="0"
            dark
            :to="{name: 'sales'}"
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-chart-pie</v-icon>Credit
              <v-spacer></v-spacer>
              Ksh {{sales_today_credit}}
            </v-card-title>
          </v-card>
      </v-col>
    </v-row>
    <h3>Today's Purchases And Expenses</h3>
    <v-divider dark color="primary"></v-divider>
    <v-row class="mb-3">
      <v-col cols="12" md="6">
        <v-card
            elevation="0"
            color="purple"
            dark
            :to="{name: 'expenses-purchases'}"
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-chart-pie</v-icon>Stock Purchases
              <v-spacer></v-spacer>
              Ksh {{purchases_today}}
            </v-card-title>
          </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card
            elevation="0"
            color="brown"
            dark
            :to="{name: 'expenses'}"
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-chart-pie</v-icon>All Expenses
              <v-spacer></v-spacer>
              Ksh {{expenses_today}}
            </v-card-title>
          </v-card>
      </v-col>
    </v-row>
    <h3>Bills And Products</h3>
    <v-divider dark color="primary"></v-divider>
    <v-row>
      <v-col cols="12" md="4">
        <v-card
            elevation="0"
            color="teal"
            dark
            :to="{name: 'pos'}"
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-chart-pie</v-icon>Pending bills
              <v-spacer></v-spacer>
              {{carts}}
            </v-card-title>
          </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card
            elevation="0"
            color="red"
            dark
            :to="{name: 'pos-onhold'}"
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-chart-pie</v-icon>Bills On Hold
              <v-spacer></v-spacer>
              {{carts_onhold}}
            </v-card-title>
          </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card
            elevation="0"
            color="primary"
            dark
            :to="{name: 'products'}"
          >
            <v-card-title class="headline">
              <v-icon class="mr-1">mdi-cart</v-icon>Products
              <v-spacer></v-spacer>
              {{products}}
            </v-card-title>
          </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data(){
    return {
      products: 0,
      carts: 0,
      carts_onhold: 0,

      sales_today: 0,
      sales_today_cash: 0,
      sales_today_mpesa: 0,
      sales_today_credit: 0,

      expenses_today: 0,
      purchases_today: 0,
    }
  },

  created(){
    this.fetchProducts();
    this.fetchCarts();
    this.fetchCartsOnHold();
    this.fetchSales();
    this.fetchExpenses();
  },

  methods: {
    fetchSales(){
      this.$axios.get(`/sales_today`).then(res => {
        this.sales_today = res.data
      })

      this.$axios.get(`/sales_today_cash`).then(res => {
        this.sales_today_cash = res.data
      })

      this.$axios.get(`/sales_today_mpesa`).then(res => {
        this.sales_today_mpesa = res.data
      })

      this.$axios.get(`/sales_today_credit`).then(res => {
        this.sales_today_credit = res.data
      })
    },
    fetchProducts(){
        this.$axios.get(`/products`)
           .then(res => {
             this.products = res.data.data.length;
           })
           .catch(error => {
             console.log(error.data);
           })
        },

    fetchCarts(){
            this.$axios.get(`/carts`)
            .then(res => {
                this.carts = res.data.length;
            })
            .catch(error => {
                console.log(error.data);
            })
        },
    fetchCartsOnHold(){
            this.$axios.get(`/carts_onhold`)
            .then(res => {
                this.carts_onhold = res.data.length;
            })
            .catch(error => {
                console.log(error.data);
            })
        },

    fetchExpenses(){
          this.$axios.get(`/expenses_today`)
            .then(res => {
                this.expenses_today = res.data;
          })

          this.$axios.get(`/purchases_today`)
            .then(res => {
                this.purchases_today = res.data;
          })
    },
  }
}
</script>

<style>

</style>