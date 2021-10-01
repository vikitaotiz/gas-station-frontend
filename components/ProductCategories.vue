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
        <v-toolbar-title>Categories</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search categories Name..."
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
                    <v-text-field autofocus outlined dense v-model="editedItem.title" label="categories Name"></v-text-field>
                  </v-col>
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

    <template v-slot:[`item.actions`]="{ item }">
      <v-icon
        v-if="item.title !== 'Administrator'"
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        v-if="item.title !== 'Administrator'"
        @click="confirmDelete(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>

<v-dialog v-model="dialogConfirmDelete" persistent max-width="500">
      <v-card>
        <v-card-title class="headline">Confirm category Deletion?</v-card-title>
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
          sortable: false,
          value: 'title',
        },
        { text: 'Created', value: 'created_at' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],

      categories: [],

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
        return this.editedIndex === -1 ? 'New Product Category' : 'Edit Product Category'
      },

      filteredData(){
          return this.categories.filter((text) => {
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
      this.fetchCategories();
    },

    methods: {
      back(){
        this.$router.back();
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
        this.editedIndex = this.categories.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      confirmDelete(item){
        this.dialogConfirmDelete = true
        this.deletedCategory = item
      },

      deleteItem (item) {
        const index = this.categories.indexOf(item)

        let delete_category = this.$axios.delete(`/product_categories/${item.id}`)
           .then(response => {
             this.dialogConfirmDelete = false
             this.$toast.success(`Category created successfully!`, {
               duration: 1000
             })
             this.categories.splice(index, 1)
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
              Object.assign(this.categories[this.editedIndex], this.editedItem)
          this.$axios.patch(`/product_categories/${this.editedItem.id}`, { title: this.editedItem.title })
           .then(response => {
              // Object.assign(this.categories[this.editedIndex], this.editedItem)
           }).catch(error => { console.log(error) })
        } else {
          this.$axios.post(`/product_categories`, { title: this.editedItem.title })
           .then(response => {
             this.$toast.success(`categories deleted successfully!`, {
               duration: 1000
             })
             this.categories.push(response.data.data)
           }).catch(error => { console.log(error.data) })
          //this.categories.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>
