<template>
<div>
  <v-data-table
    :headers="headers"
    :items="filteredData"
    sort-by="name"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-btn text @click="back">
                  <v-icon>mdi-arrow-left</v-icon> Back
                </v-btn>
      <v-toolbar flat color="white">
        <v-toolbar-title>Today's Purchases</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search Purchase Name..."
            single-line
            dense
            hide-details
          ></v-text-field>

        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on" fab>
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-divider></v-divider>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-overflow-btn
                    autofocus
                      dense
                      editable
                      :items="products"
                      label="Select Product to Purchase"
                      item-text="title"
                      item-value="id"
                      v-model="editedItem.product_id"
                    ></v-overflow-btn>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field type="number" dense outlined v-model="editedItem.quantity" label="Quantity"></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field type="number" dense outlined v-model="editedItem.buying_price" label="Amount (Ksh)"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-overflow-btn
                    autofocus
                      dense
                      editable
                      :items="payments"
                      label="Select Payment Mode"
                      item-text="title"
                      item-value="title"
                      v-model="editedItem.mode"
                    ></v-overflow-btn>
                  </v-col>
                </v-row>
                <v-row v-if="editedItem.mode === 'Credit' || editedItem.mode === 'credit'">
                  <v-text-field v-model="editedItem.lender" dense outlined label="Lender Name..."></v-text-field>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-btn color="red darken-1" text @click="close">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-toolbar>
    </template>
  </v-data-table>

</div>
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      dialogConfirmDelete: false,
      search: '',
      headers: [
        {
          text: 'Name',
          align: 'start',
          value: 'title',
        },
        { text: 'Amount (Ksh)', value: 'buying_price' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Mode', value: 'mode' },
        { text: 'Created By', value: 'user' },
        { text: 'Created On', value: 'created_at' },
      ],

      purchases: [],
      payments: [],
      products: [],

      editedIndex: -1,

      editedItem: {
        product_id: '',
        lender: '',
        quantity: 0,
        buying_price: 0,
        mode: 'Cash',
      },

      defaultItem: {
        product_id: '',
        lender: '',
        quantity: 0,
        buying_price: 0,
        mode: 'Cash',
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Purchase' : 'Edit Purchase'
      },

      filteredData(){
          return this.purchases.filter((text) => {
            return  text.title.toLowerCase().includes(this.search.toLowerCase())
          })
        }
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    created () {
      this.fetchPurchases();
      this.fetchProducts();
      this.fetchPayments();
    },

    methods: {
      back(){
        this.$router.back();
      },

      fetchPurchases(){
        this.$axios.get(`/purchases`)
           .then(response => {
             this.purchases = response.data.data;
           })
           .catch(error => {
             console.log(error.data);
           })
        },

      fetchProducts(){
        this.$axios.get(`/products`)
           .then(res => {
             this.products = res.data.data;
           })
           .catch(error => {
             console.log(error.data);
           })
        },

      fetchPayments(){
        this.$axios.get(`/payments`)
           .then(response => {
             this.payments = response.data.data;
           })
           .catch(error => {
             console.log(error.data);
           })
        },

      editItem (item) {
        this.editedIndex = this.purchases.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        let data = {
          product_id: this.editedItem.product_id,
          lender: this.editedItem.lender,
          quantity: this.editedItem.quantity,
          buying_price: this.editedItem.buying_price,
          mode: this.editedItem.mode
        }

        if (this.editedIndex > -1) {
              Object.assign(this.purchases[this.editedIndex], this.editedItem)
          this.$axios.patch(`/purchases/${this.editedItem.id}`, data)
           .then(response => {
             console.log('1234')
              // Object.assign(this.purchases[this.editedIndex], this.editedItem)
           }).catch(error => { console.log(error) })
        } else {
          this.$axios.post(`/save_purchase`, data)
           .then(res => {
             this.$toast.success(`Purchase made successfully!`, {
               duration: 1000
             })
             
             this.purchases = [];
             this.fetchPurchases();
             this.close()

           }).catch(error => { console.log(error.data) })
          //this.purchases.push(this.editedItem)
        }
      },
    },
  }
</script>
