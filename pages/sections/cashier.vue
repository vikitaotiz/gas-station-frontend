<template>
  <div>
      <v-card class="pa-3" style="border: 1px solid #827717;">

      <v-data-iterator
      :items="carts"
      :items-per-page.sync="itemsPerPage"
      :search="search"
    >
      <template v-slot:header>
        <v-row>
            <v-col cols="12" md="6">
                <h3 style="color: black;">Cashier Bills</h3>
            </v-col>
            <v-col cols="12" md="6">
                <v-text-field
                    v-if="carts.length"
                    v-model="search"
                    clearable
                    dense
                    outlined
                    rounded
                    flat
                    solo-inverted
                    hide-details
                    prepend-inner-icon="mdi-magnify"
                    label="Search in this category"
                ></v-text-field>
            </v-col>
        </v-row>
      
      <v-divider></v-divider>

      </template>

      <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="(cart,index) in props.items"
            :key="index"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card outlined style="border: 1px solid #827717;">
              <div>
                <v-row class="pa-2">
                    <v-col cols="10"><b> {{cart.bill}}</b></v-col>
                    <!-- <v-col cols="2">
                        <v-icon color="red" @click="deleteBill(cart)">mdi-delete</v-icon>
                    </v-col> -->
                </v-row><hr>
                <v-simple-table dense>
                <template v-slot:default>
                <thead>
                    <tr>
                        <th class="text-left">
                            Name
                        </th>
                        <th class="text-left">
                            Qty
                        </th>
                        <th class="text-left">
                            Price
                        </th>
                        <th class="text-left">
                            Total
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(prod, index) in cart.content" :key="index">
                        <td>{{prod.title}}</td>
                        <td>
                            {{prod.quantity}}
                        </td>
                        <td>{{prod.selling_price}}</td>
                        <td>{{prod.total_price_per_item}}</td>
                    </tr>
                </tbody>
                </template>
                </v-simple-table>
                </div>
                <v-divider dark color="primary"></v-divider>
                <v-row no-gutters class="mt-2">
                    <v-col cols="12" md="6">
                        <v-btn block depressed small tile dark color="black" @click="openPrintDialog(cart)">
                            <v-icon small color="white">mdi-printer</v-icon> Print
                        </v-btn>
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-btn @click="openPaymentsDialog(cart)" block depressed small tile dark color="primary">
                            <v-icon small color="white">mdi-credit-card</v-icon> Sell
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
    </v-card>

    <v-dialog
        v-model="dialogPrint"
        width="400"
        >
        <v-card>
            <v-card-title class="text-h5 grey darken-2">
               <span style="color: white">{{printerContent.bill}}</span> 
            <v-spacer></v-spacer>
            <v-btn
                text
                color="white"
                @click="printBill"
            >
                <v-icon>mdi-printer</v-icon> Print
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
                text
                @click="dialogPrint = false"
            >
                <v-icon color="white">mdi-close</v-icon>
            </v-btn>
            </v-card-title>

            <v-card-text class="mt-3">
                <div id='printContent' style="text-align: center;" class="printSurface">
                <div><h2>TANAGER RESTAURANT</h2></div>
                <hr>
                <p> Receipt No : {{printerContent.receipt_no}}<br>
                    Address : Nairobi, Kenya</br>
                    Email   : ######</br>
                    Phone   : #####</br></br>
                    <b>TILL NUMBER   : ####</b></br>
                </p>
                <table style="width: 100%; border-collapse: collapse; border-bottom: 1px solid;">
                    <thead style="border-top: 1px solid; border-bottom: 1px solid;" class="printTableHead">
                        <th>Name</th>
                        <th>QTY</th>
                        <th>Price</th>
                        <th>Amount (Ksh)</th>
                    </thead>
                    <tbody>
                            <tr v-for="(item, index) in printerContent.content" :key="index">
                                <td>{{item.title}}</td>
                                <td>{{item.quantity}}</td>
                                <td>{{item.selling_price}}</td>
                                <td>{{item.quantity * item.selling_price}}</td>
                            </tr><br>
                        <tr style="border-top: 1px solid" class="printTableFoot">
                            <td></td><td></td><td>Total</td><td>{{printerContentTotal}}</td>
                            </tr>
                    </tbody>
                </table>

                <p class="tabletitle">
                    <h5>VAT 16% : {{printerContentTotal * 0.16}}</h5>
                    <small>SUB TOTAL : {{printerContentTotal - (printerContentTotal * 0.16)}}</small>
                    </p>
                    <p style="border-bottom: 1px solid;" class="printSurfaceExtra">
                        <b>TOTAL : Ksh {{printerContentTotal}}</b>
                    </p>
                <p style="border-bottom: 1px solid;" class="printSurfaceExtra">Bill : {{printerContent.bill}}<br>
                        Served By : {{printerContent? printerContent.user.name : ''}}<br>
                        Printed On : {{today()}}<p>
                    <div id="legalcopy">
                        <p class="legal">
                        <strong>Thank you for your business!</strong>
                        </p>
	                </div>
                </div>
            </v-card-text>
        </v-card>
        </v-dialog>

    <!-- <v-dialog v-model="dialogConfirmDelete" persistent max-width="300">
      <v-card>
        <v-card-title class="headline">Confirm Deletion?</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="color: red;" class="pa-2"><v-icon dark color="red">mdi-alert</v-icon>
        This process is permanent !!!</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" text @click="dialogConfirmDelete = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="deleteAllItems">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->

    <v-dialog
        v-model="dialogPayments"
        width="500"
        >
        <v-card>
            <v-card-title class="text-h5 primary lighten-2">
            Select payment mode (Ksh {{printerContentTotal}})
            <v-spacer></v-spacer>
            <v-btn
                text
                @click="dialogPayments = false"
            >
                <v-icon>mdi-close</v-icon>
            </v-btn>
            </v-card-title>

            <v-card-text>
                <v-overflow-btn
                      dense
                      editable
                      :items="payments"
                      label="Select payment mode"
                      item-text="title"
                      item-value="title"
                      v-model="paymentMode"
                    ></v-overflow-btn>
                <div v-if="paymentMode === 'Credit' || paymentMode === 'credit'">
                    <v-text-field type="text" label="Creditor Name" dense outlined v-model="creditorName"></v-text-field>
                </div>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                v-if="paymentMode"
                color="primary"
                text
                block
                @click="sendToSale"
            >
                Save Transaction
            </v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>

  </div>
</template>

<script>
import moment from 'moment';
if(process.client) {
  let print = require('print-js')
}

export default {
    middleware: ['auth'],
    data(){
        return {
            carts: [],
            itemsPerPage: 4,
            search: '',

            bills: [],
            bill_id: '',
            selectedProduct: '',
            selectedCart: '',

            payments: [],
            paymentMode: 'Cash',
            dialogPayments: false,
            dialogPrint: false,
            printerContent: '',
            printerContentTotal: 0,
        }
    },

    created(){
        this.fetchCarts();
        this.fetchPayments();
    },

    methods: {
        today(){
            return moment().format('MMMM Do YYYY, h:mm a');
        },

        totalCost(arr){
            let sum = 0;
            if(arr.length > 0){
                arr.forEach(el => {
                    sum += el.total_price_per_item;
                });
                return sum;
            } else {
                return sum
            }         
        },

        fetchCarts(){
            this.$axios.get(`/carts_cashier`)
            .then(res => {
                this.carts = res.data.filter(val => {
                    return val.content.length;
                })
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

        formatDate(date){
            return moment(date).format('MMMM Do YYYY, h:mm a');
        },

        removeFromHold(cart){
            this.$axios.post('/remove_bill_onhold', cart).then(res => {
                this.carts = [];
                this.fetchCarts();
                this.$toast.success('Bill removed from hold!', {
                    duration: 2000
                });
            })
        },

        openPrintDialog(cart){
            this.printerContentTotal = this.totalCost(cart.content)
            this.dialogPrint = true
            this.printerContent = cart
        },

        printBill(){
            this.dialogPrint = false;

            printJS({
                printable: "printContent",
                type: "html",
                style: 
                 "table {width: 100%; border-collapse: collapse; border-bottom: 1px solid;} .printSurface {text-align: center; margin: auto;} .printTableHead {border-top: 1px solid; border-bottom: 1px solid;} .printTableFoot {border-top: 1px solid} @media print{ width: 400px;} .printSurfaceExtra {border-bottom: 1px solid;}"
            });
        },

        openPaymentsDialog(cart){
            this.printerContentTotal = this.totalCost(cart.content)
            this.dialogPayments = true
            this.printerContent = cart            
        },

        sendToSale(){
            let data = {
                cart_id: this.printerContent.id,
                bill: this.printerContent.bill,
                receipt_no: this.printerContent.receipt_no,
                mode: this.paymentMode,
                amount: this.printerContentTotal,
                content: this.printerContent.content
            }

            if(this.paymentMode === 'Credit' || this.paymentMode === 'credit'){
                if(!this.creditorName){
                    alert('Creditor Name Cannot be blank!!')
                } else {
                    data.creditor_name = this.creditorName
                }
            }

            this.$axios.post('/sales', data).then(res => {
                this.dialogPayments = false 
                this.carts = [];
                this.fetchCarts();
                this.$toast.success('Bill placed on hold!', {
                    duration: 2000
                });
            })       
        }
    }
}
</script>

<style>

</style>