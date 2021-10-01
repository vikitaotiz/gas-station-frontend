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
        <v-toolbar-title>Expenses</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search Expense Name..."
            single-line
            dense
            hide-details
          ></v-text-field>

        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="600px">
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
                    <v-text-field autofocus outlined dense v-model="editedItem.title" label="Expense Name"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-overflow-btn
                      dense
                      editable
                      :items="categories"
                      label="Select Category"
                      item-text="title"
                      item-value="id"
                      v-model="editedItem.expense_category_id"
                    ></v-overflow-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field type="number" outlined dense v-model="editedItem.buying_price" label="Amount (Ksh)"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field type="number" outlined dense v-model="editedItem.quantity" label="Quantity"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-overflow-btn
                      dense
                      editable
                      :items="payments"
                      label="Select Payment Mode"
                      item-text="title"
                      item-value="title"
                      v-model="editedItem.mode"
                    ></v-overflow-btn>
                  </v-col>
                  <v-col cols="12" md="6" v-if="editedItem.mode === 'Credit' || editedItem.mode === 'credit'">
                    <v-text-field outlined dense v-model="editedItem.lender" label="Lender's Name.."></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-textarea outlined dense v-model="editedItem.description" label="Expense Description"></v-textarea>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-btn color="red" text @click="close">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="blue" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-toolbar>
    </template>

    <template v-slot:[`item.actions`]="{ item }">
      <v-icon
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        @click="confirmDelete(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>

<v-dialog v-model="dialogConfirmDelete" persistent max-width="300">
      <v-card>
        <v-card-title class="headline">Confirm Expense Deletion?</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="color: red;" class="pa-2"><v-icon dark color="red">mdi-alert</v-icon>
        This process is permanent !!!</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" text @click="dialogConfirmDelete = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="deleteItem(deletedExpense)">Confirm</v-btn>
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
      deletedExpense: '',
      search: '',
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'title',
        },
        { text: 'QTY', value: 'quantity' },
        { text: 'Amount', value: 'buying_price' },
        { text: 'Mode', value: 'mode' },
        { text: 'Category', value: 'category' },
        { text: 'User', value: 'user' },
        { text: 'Created', value: 'created_at' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],

      expenses: [],
      categories: [],
      payments: [],

      editedIndex: -1,

      editedItem: {
        title: '',
        lender: '',
        description: '',
        quantity: 0,
        buying_price: 0,
        mode: 'Cash',
        expense_category_id: ''
      },

      defaultItem: {
        title: '',
        lender: '',
        description: '',
        quantity: 0,
        buying_price: 0,
        mode: 'Cash',
        expense_category_id: ''
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Expense' : 'Edit Expense'
      },

      filteredData(){
          return this.expenses.filter((text) => {
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
      this.fetchExpenses();
      this.fetchCategories();
      this.fetchPayments();
    },

    methods: {
      back(){
        this.$router.back();
      },

      fetchExpenses(){
        this.$axios.get(`/expenses`)
           .then(response => {
             this.expenses = response.data.data;
           })
           .catch(error => {
             console.log(error.data);
           })
        },

      fetchCategories(){
        this.$axios.get(`/expense_categories`)
           .then(response => {
             this.categories = response.data.data;
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
        this.editedIndex = this.expenses.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      confirmDelete(item){
        this.dialogConfirmDelete = true
        this.deletedExpense = item
      },

      deleteItem (item) {
        const index = this.expenses.indexOf(item)

        let delete_user = this.$axios.delete(`/expenses/${item.id}`)
           .then(response => {
             this.dialogConfirmDelete = false
             this.$toast.success(`Expense created successfully!`, {
               duration: 1000
             })
             this.expenses.splice(index, 1)
           }).catch(error => { console.log(error)})

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
            title: this.editedItem.title,
            lender: this.editedItem.lender,
            description: this.editedItem.description,
            quantity: this.editedItem.quantity,
            buying_price: this.editedItem.buying_price,
            mode: this.editedItem.mode,
            expense_category_id: this.editedItem.expense_category_id
        }
        if (this.editedIndex > -1) {
              Object.assign(this.expenses[this.editedIndex], this.editedItem)
          this.$axios.patch(`/expenses/${this.editedItem.id}`, data)
           .then(response => {
             console.log('1234')
              // Object.assign(this.expenses[this.editedIndex], this.editedItem)
           }).catch(error => { console.log(error) })
        } else {
          this.$axios.post(`/expenses`, data)
           .then(response => {
             this.$toast.success(`Expense deleted successfully!`, {
               duration: 1000
             })
             this.expenses.push(response.data.data)
           }).catch(error => { console.log(error.data) })
          //this.expenses.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>
