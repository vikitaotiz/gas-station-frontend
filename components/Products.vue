<template>
<div>
  <v-data-table
    :headers="headers"
    :items="filteredData"
    sort-by="title"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-btn text @click="back">
                  <v-icon>mdi-arrow-left</v-icon> Back
                </v-btn>
      <v-toolbar flat color="white">
        <v-toolbar-title>Products</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search products Name..."
            single-line
            dense
            hide-details
          ></v-text-field>

        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="700">
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
                    <v-text-field autofocus outlined dense v-model="editedItem.title" label="Title"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-overflow-btn
                      dense
                      editable
                      :items="categories"
                      label="Select Category"
                      item-text="title"
                      item-value="id"
                      v-model="editedItem.product_category_id"
                    ></v-overflow-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field type="number" outlined dense v-model="editedItem.buying_price" label="Buying Price"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field type="number" outlined dense v-model="editedItem.selling_price" label="Selling Price"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field type="number" outlined dense v-model="editedItem.quantity" label="Quantity"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field type="number" outlined dense v-model="editedItem.min_qty" label="Minimum Quantity"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field outlined dense v-model="editedItem.image_url" label="Image Url: https://image_url..."></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-textarea
                    outlined
                    v-model="editedItem.description"
                    name="input-7-4"
                    label="Product Description"
                  ></v-textarea>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-btn color="red" text @click="close">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-toolbar>
    </template>

    <template v-slot:[`item.image_url`]="{ item }">
      <div>
        <img v-if="item.image_url" :src="item.image_url" alt="Product Image" width="50px" height="50px">
        <img v-else src="data:image/jpeg;base64,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" alt="Product Image" width="50px" height="50px">
      </div>
    </template>

    <template v-slot:[`item.actions`]="{ item }">
      <v-icon
        color="green"
        v-if="item.title !== 'Administrator'"
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        color="red"
        v-if="item.title !== 'Administrator'"
        @click="confirmDelete(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>

<v-dialog v-model="dialogConfirmDelete" persistent max-width="600">
      <v-card>
        <v-card-title class="headline">Confirm product Deletion?</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="color: red;" class="pa-2"><v-icon dark color="red">mdi-alert</v-icon>
        This process is permanent !!!</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" text @click="dialogConfirmDelete = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="deleteItem(deletedCategory)">Confirm</v-btn>
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
      deletedCategory: '',
      search: '',
      headers: [
        {
          text: 'Name',
          align: 'start',
          value: 'title',
        },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Stock', value: 'min_qty' },
        { text: 'Buying Price', value: 'buying_price' },
        { text: 'Selling Price', value: 'selling_price' },
        { text: 'Image', value: 'image_url' },
        { text: 'Category', value: 'category' },
        { text: 'Created By', value: 'user' },
        { text: 'Created On', value: 'created_at' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],

      categories: [],
      products: [],

      editedIndex: -1,

      editedItem: {
        title: '',
        product_category_id: '',
        buying_price: 0,
        selling_price: 0,
        quantity: 0,
        min_qty: 0,
        image_url: '',
        description: ''
      },

      defaultItem: {
        title: '',
        product_category_id: '',
        buying_price: 0,
        selling_price: 0,
        quantity: 0,
        min_qty: 0,
        image_url: '',
        description: ''
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Product' : 'Edit Product'
      },

      filteredData(){
          return this.products.filter((text) => {
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
      this.fetchProducts();
      this.fetchCategories();
    },

    methods: {
      back(){
        this.$router.back();
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
      
      fetchCategories(){
        this.$axios.get(`/product_categories`)
           .then(res => {
             this.categories = res.data.data;
           })
           .catch(error => {
             console.log(error.data);
           })
        },

      editItem (item) {
        this.editedIndex = this.products.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      confirmDelete(item){
        this.dialogConfirmDelete = true
        this.deletedCategory = item
      },

      deleteItem (item) {
        const index = this.products.indexOf(item)

        this.$axios.delete(`/products/${item.id}`)
           .then(res => {
             this.dialogConfirmDelete = false
             this.$toast.success(`Category created successfully!`, {
               duration: 1000
             })
             this.products.splice(index, 1)
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
            product_category_id: this.editedItem.product_category_id,
            buying_price: this.editedItem.buying_price,
            selling_price: this.editedItem.selling_price,
            quantity: this.editedItem.quantity,
            min_qty: this.editedItem.min_qty,
            image_url: this.editedItem.image_url,
            description: this.editedItem.description
          }

        if (this.editedIndex > -1) {
              Object.assign(this.categories[this.editedIndex], this.editedItem)
          this.$axios.patch(`/products/${this.editedItem.id}`, data)
           .then(response => {
             this.products = [];
             this.fetchProducts();
             this.close()

              // Object.assign(this.categories[this.editedIndex], this.editedItem)
           }).catch(error => { console.log(error) })
        } else {
          
          this.$axios.post(`/products`, data)
           .then(response => {
             this.$toast.success(`categories deleted successfully!`, {
               duration: 1000
             })
             this.products.push(response.data.data)
             this.close()
           }).catch(error => { console.log(error.data) })
          //this.categories.push(this.editedItem)
        }
      },
    },
  }
</script>
