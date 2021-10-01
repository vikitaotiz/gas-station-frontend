<template>
  <div>
      <v-row>
          <v-col cols="12" md="8">
              <v-card style="border: 1px solid #827717;">
                  <div class="pa-2 primary">
                      <v-btn @click="selectCategory(category)" small outlined class="ma-1" color="white" v-for="(category, index) in categories" :key="index">
                          {{category.title}}
                      </v-btn>
                  </div>
                  <v-divider style="border: 1px solid #827717;"></v-divider>
                  <v-card-text>
                      
                          <v-data-iterator
                            :items="products"
                            :search="search"
                            :items-per-page.sync="itemsPerPage"
                            >
                            <template v-slot:header>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <h3 style="color: black;">{{product_category_name.toUpperCase()}}</h3>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field
                                            v-if="products.length"
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
                                <v-divider style="border: 1px solid orange;"></v-divider>
                            </template>


                            <template v-slot:default="props">
                                <v-row>
                                <v-col
                                    v-for="(item, index) in props.items"
                                    :key="index"
                                    cols="12"
                                    sm="6"
                                    md="3"
                                    lg="3"
                                >
                                    <v-card outlined style="border: 1px solid orange;">
                                        <div class="">
                                            <img v-if="item.image_url" :src="item.image_url" alt="Product Image" style="width: 100%; height: 110px;">
                                            <img v-else src="data:image/jpeg;base64,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" alt="Product Image" style="width: 100%; height: 110px;">
                                        </div>
                                        <v-divider></v-divider>
                                        <div class="pa-2">
                                           <b>{{ item.title }}</b>

                                            <small>
                                                <hr>
                                            <ul>
                                                <li v-if="Number(item.kitchen)">Kitchen</li>
                                                <li v-if="Number(item.barista)">Barista</li>
                                            </ul>
                                            <hr>
                                        </small>
                                        </div>
                                        <v-row no-gutters>
                                            <v-col cols="12" md="8" class="pt-1" style="background: black; color: white;">
                                                <b class="pa-4">Ksh {{ item.selling_price }}</b>
                                            </v-col>
                                            <v-col cols="12" md="4">
                                                <v-btn tile block small depressed dark color="orange" @click="selectProduct(item)">
                                                <v-icon>mdi-plus</v-icon></v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-card>
                                </v-col>
                                </v-row>
                            </template>

                            </v-data-iterator>

                  </v-card-text>
              </v-card>
          </v-col>
          <v-col cols="12" md="4">
              <v-card style="border: 1px solid #827717;">
                  <div class="primary pl-2">
                      <v-row>
                          <v-col cols="12" md="9" style="color: white;">Cart</v-col>
                          <v-col cols="12" md="3" v-if="carts.length">
                              <v-btn @click="clearAll" small text>
                                        <v-icon color="white">mdi-delete</v-icon>
                                </v-btn>
                          </v-col>
                      </v-row>
                  </div>
                  <div class="pa-1">
                      <v-text-field
                        v-if="carts.length > 1"
                        class="mb-1"
                        v-model="searchBill"
                        clearable
                        dense
                        outlined
                        flat
                        solo-inverted
                        hide-details
                        prepend-inner-icon="mdi-magnify"
                        label="Search bill..."
                      ></v-text-field>
                      <v-card v-for="(cart, index) in filterBills" :key="index" 
                        outlined class="mb-2" 
                        :class="[!Number(cart.sent) ? 'notSentColor' : 'sentColor']">
                          <div>
                              <v-row class="px-1">
                                  <v-col cols="5"><b> {{cart.bill}}</b></v-col>
                                  <v-col cols="5"><b> Ksh {{totalCost(cart.content)}}</b></v-col>
                                  <v-col cols="2">
                                      <v-icon color="red" @click="deleteBill(cart)">mdi-delete</v-icon>
                                  </v-col>
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
                                        <th class="text-left">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(prod, index) in cart.content" :key="index"
                                     :class="[!Number(prod.added) ? '' : 'addedItem']">
                                        <td>{{prod.title}}</td>
                                        <td>
                                            <v-btn x-small rounded outlined color="green" @click="changeQty(prod, cart)">{{prod.quantity}}</v-btn>
                                        </td>
                                        <td>{{prod.selling_price}}</td>
                                        <td>{{prod.total_price_per_item}}</td>
                                        <td><v-icon v-if="cart.content.length > 1" @click="deleteSinglePoduct(prod, cart)" color="red">mdi-delete</v-icon></td>
                                    </tr>
                                </tbody>
                                </template>
                              </v-simple-table>
                           </div><hr class="mt-1 mb-1">
                           <v-row no-gutters>
                               <v-col cols="12" md="4">
                                   <v-btn block depressed tile x-small dark color="black" @click="openPrintDialog(cart)">
                                    <v-icon small color="white">mdi-printer</v-icon> Print
                                </v-btn>
                               </v-col>

                               <v-col cols="12" md="4">
                                   <v-btn block v-if="!Number(cart.sent)" tile depressed x-small dark color="orange" @click="putOnHold(cart)">
                                    <v-icon small color="white">mdi-hand</v-icon> Hold
                                </v-btn>
                               </v-col>
                                
                                <!-- <v-col cols="12" md="4">
                                    <v-btn @click="openPaymentsDialog(cart)" block depressed small dark color="primary">
                                        <v-icon color="white">mdi-credit-card</v-icon> Sell
                                    </v-btn>
                                </v-col> -->
                                <v-col cols="12" md="4" v-if="!Number(cart.sent)">
                                    <v-btn @click="sendOrder(cart)" tile block depressed x-small dark color="success">
                                        <v-icon small color="white">mdi-check</v-icon> Send
                                    </v-btn>
                                </v-col>
                            </v-row>
                      </v-card>
                  </div>
              </v-card>
          </v-col>
      </v-row>


      <v-dialog
        v-model="dialogBill"
        width="500"
        >
        <v-card>
            <v-card-title class="text-h5 primary lighten-2">
            Select Bill
            <v-spacer></v-spacer>
            <v-btn
                text
                @click="dialogBill = false"
            >
                <v-icon>mdi-close</v-icon>
            </v-btn>
            </v-card-title>

            <v-card-text>
                <v-overflow-btn
                      dense
                      editable
                      :items="bills"
                      label="Select Category"
                      item-text="name"
                      item-value="id"
                      v-model="bill_id"
                    ></v-overflow-btn>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                v-if="bill_id"
                color="primary"
                text
                block
                @click="addToCart"
            >
                ADD
            </v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>

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

    <v-dialog v-model="dialogChangeQty" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">Change Qty for {{selectedProduct.title}}?          
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-2">
            <v-text-field type="number" label="Quantity" dense outlined v-model="productQuantity"></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn small color="red" text @click="dialogChangeQty = false">
                <v-icon>mdi-close</v-icon> Close
            </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" small text @click="updateProductQty" v-if="productQuantity">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirmDelete" persistent max-width="300">
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
    </v-dialog>

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
    data(){
        return {
            categories: [],
            products: [],
            carts: [],
            product_category_name: '',
            itemsPerPage: 4,
            search: '',
            dialogBill: false,
            dialogPrint: false,
            productSelected: '',

            bills: [],
            bill_id: '',
            printerContent: '',
            printerContentTotal: 0,
            billTotal: 0,
            dialogConfirmDelete: false,
            dialogChangeQty: false,
            selectedProduct: '',
            selectedCart: '',
            productQuantity: 0,

            dialogPayments: false,
            payments: [],
            paymentMode: 'Cash',
            creditorName: '',
            searchBill: '',
        }
    },

    computed:{
        filterBills(){
            console.log(this.searchBill)
            if(this.searchBill){
                return this.carts.filter((item)=>{
                    return this.searchBill.toLowerCase().split(' ').every(v => item.bill.toLowerCase().includes(v))
                })
                }else{
                    return this.carts;
                }
        },
    },

    created(){
        this.fetchCategories();
        this.fetchCarts();
        this.fetchBills();
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

        fetchCategories(){
            this.$axios.get(`/product_categories`)
            .then(res => {
                this.categories = res.data.data;
                this.products = this.categories[0].products
                this.product_category_name = this.categories[0].title
            })
            .catch(error => {
                console.log(error.data);
            })
        },

        fetchCarts(){
            this.$axios.get(`/carts`)
            .then(res => {
                this.carts = res.data.sort((a,b)=>{
                    return a.sent - b.sent;
                });
            })
            .catch(error => {
                console.log(error.data);
            })
        },

        fetchBills(){
        this.$axios.get(`/bills`)
           .then(res => {
             this.bills = res.data.data;
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

        selectCategory(category){
            this.products = category.products
            this.product_category_name = category.title
        },

        selectProduct(item){
            this.dialogBill = true
            this.selectedProduct = item
        },

        addToCart(){
            this.dialogBill = false
            
            let billObject = this.bills.find(obj => {
                return obj.id === this.bill_id
            })

            let productAdded = 0
            let sentCart = this.carts.find(obj => {
                return Number(obj.bill_id) === billObject.id;
            })
            if(sentCart){
                productAdded = Number(sentCart.sent) ? 1 : 0;
            }

            let total = this.selectedProduct.selling_price * 1;
            
            let product =  {
                title: this.selectedProduct.title,
                kitchen: this.selectedProduct.kitchen,
                barista: this.selectedProduct.barista,
                description: this.description,
                quantity: 1,
                added: productAdded,
                buying_price: this.selectedProduct.buying_price,
                selling_price: this.selectedProduct.selling_price,
                total_price_per_item: total,
                category: this.selectedProduct.category
            }

            let productArray = []
            productArray.push(product)

            let data = {
                bill: billObject.name,
                bill_id: this.bill_id,
                hold: 0,
                amount: total,
                content: productArray
            }

            this.$axios.post(`/bill_cart`, data).then(res => {
                this.carts = [];
                this.fetchCarts();
                
                this.$toast.success('Product added successfully!', {
                    duration: 2000
                });
            })
        },

        sendOrder(cart){
            this.$axios.post(`/send_order`, {cart_id: cart.id}).then(res => {
                this.$toast.success('Quantity changed successfully!', {
                    duration: 3000
                })
                this.carts = [];
                this.fetchCarts();
            })
        },

        changeQty(prod, cart){
            this.dialogChangeQty = true
            this.selectedProduct = prod
            this.selectedCart = cart
            this.productQuantity = prod.quantity
        },

        updateProductQty(){
            this.dialogChangeQty = false
            let index = this.selectedCart.content.indexOf(this.selectedProduct)
            this.selectedCart.content[index].quantity = this.productQuantity
            this.selectedCart.content[index].total_price_per_item = this.selectedCart.content[index].quantity * this.selectedCart.content[index].selling_price;
            let data = {
                cart_id: this.selectedCart.id,
                newArray: this.selectedCart.content
            }

            this.$axios.post(`/change_product_qty`, data).then(res => {
                this.$toast.success('Quantity changed successfully!', {
                    duration: 3000
                })
            })
        },

        deleteSinglePoduct(prod, cart){
            let deleteCart = confirm('Are you sure?');
            if(deleteCart){
                let index = cart.content.indexOf(prod)
                cart.content.splice(index, 1)
                let data = {
                    cart_id: cart.id,
                    newArray: cart.content
                }

                this.$axios.post(`/delete_single_product`, data).then(res => {
                    this.$toast.success('Quantity changed successfully!', {
                        duration: 3000
                    })
                })
            }
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

        deleteBill(cart){
            let deleteCart = confirm('Are you sure?');
            if(deleteCart){
                this.$axios.post(`delete_single_bill`, cart).then(res => {
                    this.carts = [];
                    this.fetchCarts();
                    this.$toast.success('Bill cleared successfully!', {
                        duration: 2000
                    });
                })
            }
        },

        clearAll(){
            this.dialogConfirmDelete = true;
        },

        deleteAllItems(){
            this.dialogConfirmDelete = false;
            this.$axios.get('/clear_all_bills').then(res => {
                // console.log(res.data)
                this.carts = [];
                this.fetchCarts();
                this.$toast.success('All bills cleared successfully!', {
                    duration: 2000
                });
            })
        },

        putOnHold(cart){
            this.$axios.post('/put_bill_onhold', cart).then(res => {
                this.bill_id = '';
                this.bills = [];
                this.fetchBills();
                this.carts = [];
                this.fetchCarts();
                this.$toast.success('Bill placed on hold!', {
                    duration: 2000
                });
            })
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
.sentColor {
    border: 2px solid red !important;
    background: rgb(227, 248, 109) !important;
}

.notSentColor {
    border: 1px solid #827717  !important;
}

.addedItem {
    background: #25bcd6 !important;
    color: white !important;
}
    /* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #827717;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #827717;
}
</style>