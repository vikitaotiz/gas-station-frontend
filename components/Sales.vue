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
        <v-toolbar-title>Sales</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search Receipt Number..."
            single-line
            dense
            hide-details
          ></v-text-field>

        <v-spacer></v-spacer>
        <b class="mr-3">{{pay_mode? pay_mode.toUpperCase(): 'ALL'}}</b>
        <small>
          <v-btn v-if="all" outlined small dark color="primary" tile @click="getAll()">ALL</v-btn>
          <v-btn outlined small dark color="primary" tile
            v-for="(button, index) in payments" :key="index" @click="filterPayment(button.title)">
            {{button.title}}
          </v-btn>
        </small>
      </v-toolbar>
    </template>
    <template v-slot:[`item.receipt_no`]="{ item }">
      <b v-if="item.mode === 'Credit'" class="error pa-2" style="color: white;">{{item.receipt_no}}</b>
      <b v-else class="primary pa-2" style="color: white;">{{item.receipt_no}}</b>
    </template>

    <template v-slot:[`item.content`]="{ item }">
      <v-icon color="green"
        @click="viewContent(item)"
      >
        mdi-eye
      </v-icon>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon
        color="red"
        v-if="item.name !== 'Administrator'"
        @click="confirmDelete(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>

<v-dialog v-model="dialogConfirmDelete" persistent max-width="300">
      <v-card>
        <v-card-title class="headline">Confirm Sale Deletion?</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="color: red;" class="pa-2"><v-icon dark color="red">mdi-alert</v-icon>
        This process is permanent !!!</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" text @click="dialogConfirmDelete = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="deleteItem(deletedSale)">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  <v-dialog v-model="dialogContent" persistent max-width="530">
      <v-card>
        <v-card-title class="headline">Content for {{selectedSale.receipt_no}}  <small class="ml-2">(Ksh {{selectedSale.amount}})</small>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogContent = false">Close</v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>

          <v-simple-table dense>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Name
                  </th>
                  <th class="text-left">
                    QTY
                  </th>
                  <th class="text-left">
                    Amount (Ksh)
                  </th>
                  <th class="text-left">
                     Total (Ksh)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(prod, index) in selectedSale.content" :key="index">
                  <td>{{prod.title}}</td>
                  <td>{{prod.quantity}}</td>
                  <td>{{prod.selling_price}}</td>
                  <td>{{prod.total_price_per_item}}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-card-actions v-if="selectedSale.mode === 'Credit'">
          <small class="ml-4"><i>Creditor Contact : {{selectedSale.creditor_name}}</i></small>
        </v-card-actions>
      </v-card>
    </v-dialog>

</div>
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      dialogConfirmDelete: false,
      dialogContent: false,
      deletedSale: '',
      search: '',
      headers: [
        {
          text: 'Receipt No.',
          align: 'start',
          value: 'receipt_no',
        },
        { text: 'Bill', value: 'bill' },
        { text: 'Amount', value: 'amount' },
        { text: 'Mode', value: 'mode' },
        { text: 'Content', value: 'content' },
        { text: 'Created By', value: 'user' },
        { text: 'Created On', value: 'created_at' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],

      sales: [],
      selectedSale: '',
      payments: [],
      pay_mode: '',
      all: false,
      data: []
    }),

    computed: {
      filteredData(){
          return this.sales.filter((text) => {
            return  text.receipt_no.toLowerCase().includes(this.search.toLowerCase())
          })
        }
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    created () {
      this.fetchSales();
      this.fetchPaymentModes();
    },

    methods: {
      back(){
        this.$router.back();
      },

      fetchSales(){
        this.$axios.get(`/sales`)
           .then(response => {
             this.sales = response.data.data;
             this.data = response.data.data;
           })
           .catch(error => {
             console.log(error.data);
           })
        },

      fetchPaymentModes(){
        this.$axios.get(`/payments`)
           .then(res => {
             this.payments = res.data.data;
           })
           .catch(error => {
             console.log(error.data);
           })
        },

      filterPayment(mode){
        this.all = true
        this.pay_mode = mode
        this.sales = []
        this.sales = this.data.filter(val => {
            return val.mode === mode
        });
      },

      getAll(){
        this.all = false
        this.pay_mode = '';
        this.sales = [];
        this.sales = this.data;
      },

      viewContent(item){
        this.dialogContent = true
        this.selectedSale = item
        console.log(item)
      },

      confirmDelete(item){
        this.dialogConfirmDelete = true
        this.deletedSale = item
      },

      deleteItem (item) {
        const index = this.sales.indexOf(item)

        this.$axios.delete(`/sales/${item.id}`)
           .then(response => {
             this.dialogConfirmDelete = false
             this.$toast.success(`Sale created successfully!`, {
               duration: 1000
             })
             this.sales.splice(index, 1)
           }).catch(error => { console.log(error)})

      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      }
    },
  }
</script>
