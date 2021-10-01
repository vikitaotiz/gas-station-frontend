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
        <v-toolbar-title>Payments</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search Payment Name..."
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
                  <v-col>
                    <v-text-field autofocus v-model="editedItem.title" label="Payment Name"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-toolbar>
    </template>

    <template v-slot:[`item.actions`]="{ item }">
      <v-icon
        v-if="item.name !== 'Administrator'"
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        v-if="item.name !== 'Administrator'"
        @click="confirmDelete(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>

<v-dialog v-model="dialogConfirmDelete" persistent max-width="300">
      <v-card>
        <v-card-title class="headline">Confirm Payment Deletion?</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="color: red;" class="pa-2"><v-icon dark color="red">mdi-alert</v-icon>
        This process is permanent !!!</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" text @click="dialogConfirmDelete = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="deleteItem(deletedPayment)">Confirm</v-btn>
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
      deletedPayment: '',
      search: '',
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'title',
        },
        { text: 'User', value: 'user' },
        { text: 'Created', value: 'created_at' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],

      payments: [],

      editedIndex: -1,

      editedItem: {
        title: ''
      },

      defaultItem: {
        title: ''
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Payment' : 'Edit Payment'
      },

      filteredData(){
          return this.payments.filter((text) => {
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
      this.fetchPayments()
    },

    methods: {
      back(){
        this.$router.back();
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
        this.editedIndex = this.payments.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      confirmDelete(item){
        this.dialogConfirmDelete = true
        this.deletedPayment = item
      },

      deleteItem (item) {
        const index = this.payments.indexOf(item)

         this.$axios.delete(`/payments/${item.id}`)
           .then(response => {
             this.dialogConfirmDelete = false
             this.$toast.success(`Payment created successfully!`, {
               duration: 1000
             })
             this.payments.splice(index, 1)
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
        if (this.editedIndex > -1) {
              Object.assign(this.payments[this.editedIndex], this.editedItem)
          this.$axios.patch(`/payments/${this.editedItem.id}`, { title: this.editedItem.title })
           .then(response => {
             console.log('1234')
              // Object.assign(this.payments[this.editedIndex], this.editedItem)
           }).catch(error => { console.log(error) })
        } else {
          this.$axios.post(`/payments`, { title: this.editedItem.title })
           .then(res => {
             this.$toast.success(`Payment deleted successfully!`, {
               duration: 1000
             })
             this.payments.push(res.data.data)
           }).catch(error => { console.log(error.data) })
        }
        this.close()
      },
    },
  }
</script>
