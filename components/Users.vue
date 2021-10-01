<template>
<div>
  <div class="text-center">
    <v-dialog
      v-model="dialogChangingUserStatus"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="orange"
        dark
      >
        <v-card-text>
          Changing User Status
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>

  <div class="text-center">
    <v-dialog
      v-model="dialogSchedule"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="orange"
        dark
      >
        <v-card-text>
          Updating User Schedule
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>

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
        <v-toolbar-title>Users</v-toolbar-title>
        <v-spacer></v-spacer>
            <v-btn small dark color="orange" v-if="users.length" depressed rounded>
                <download-excel 
                  :data="users" 
                  name="System Users Report" 
                  worksheet="System Users Report">Download Excel</download-excel>
              </v-btn>
        <v-spacer></v-spacer>

        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search User Name..."
            single-line
            dense
            hide-details
          ></v-text-field>

        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px" persistent>
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
                    <v-text-field outlined autofocus dense v-model="editedItem.name" label="User Name"></v-text-field>
                  </v-col>

                  <v-col>
                    <v-text-field outlined type="email" dense v-model="editedItem.email" label="User Email"></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-select
                      dense
                      :items="roles"
                      item-text="name"
                      item-value="id"
                      label="Select User Role"
                      outlined
                      v-model="editedItem.role_id"
                    ></v-select>
                  </v-col>

                  <v-col>
                    <v-select
                        dense
                        :items="departments"
                        item-text="name"
                        item-value="id"
                        label="Select User Department"
                        outlined
                        v-model="editedItem.department_id"
                      ></v-select>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-text-field outlined type="number" dense v-model="editedItem.pin" label="Enter User Pin"></v-text-field>
                  </v-col>

                  <v-col>
                    <v-text-field outlined type="password" dense v-model="editedItem.password" label="Enter User Password"></v-text-field>
                  </v-col>
                </v-row>

              </v-container>
            </v-card-text>
            <v-divider dark color="primary"></v-divider>
            <v-card-actions>
              <v-btn color="red" text @click="close">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-toolbar>
    </template>

    <template v-slot:[`item.name`]="{ item }">
        <v-btn v-if="item.status" rounded depressed small outlined text color="primary" @click="openDialogAddDaysTime1(item)">{{item.name}}</v-btn>
        <v-btn v-else rounded depressed small outlined text color="primary" disabled>{{item.name}}</v-btn>
    </template>

    <template v-slot:[`item.status`]="{ item }">
      <v-btn v-if="item.status" rounded depressed small outlined text color="primary" @click="switchStatus(item)">Enabled</v-btn>
      <v-btn v-else rounded depressed small outlined text color="red" @click="switchStatus(item)">Disabled</v-btn>
    </template>

      <template v-slot:[`item.actions`]="{ item }">
      <v-icon
        v-if="item.status"
        class="mr-2"
        @click="editItem(item)"
        color="primary"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        v-if="!item.status && item.role !== 'Administrator'"
        @click="confirmDelete(item)"
        color="red"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>

<v-dialog v-model="dialogConfirmDelete" persistent max-width="300">
      <v-card>
        <v-card-title class="headline">Confirm User Deletion?</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="color: red;" class="pa-2"><v-icon dark color="red">mdi-alert</v-icon>
        This process is permanent !!!</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" text @click="dialogConfirmDelete = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="deleteItem(deletedUser)">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
          v-model="dialogAddDaysTime1"
          width="700"
          persistent
        >
          <v-card>
            <v-card-title class="headline primary">
              <span style="color: #fff;">Working days and time for {{selected_user.name}}</span>
              <v-spacer></v-spacer>
              <v-btn fab small color="orange darken-3" dark depressed @click="openDialogAddDaysTime2()"><v-icon>mdi-plus</v-icon></v-btn>
            </v-card-title>
            <v-card-text class="mt-4">
              <v-simple-table dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      Day
                    </th>
                    <th class="text-left">
                      From
                    </th>
                    <th class="text-left">
                      To
                    </th>
                    <th class="text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in selected_user.schedule"
                    :key="index"
                  >
                    <td>{{ item.day }}</td>
                    <td>{{ convertTimer(item.from) }}</td>
                    <td>{{ convertTimer(item.to) }}</td>
                    <td>
                      <v-icon color="primary" @click="editSelectedItem(index)">mdi-pencil</v-icon>
                      <v-icon color="red" @click="deleteSelectedItem(index)">mdi-delete</v-icon>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            </v-card-text>

            <v-divider dark color="red"></v-divider>
            <v-card-actions>
              <v-btn
                color="red"
                text
                small
                @click="dialogAddDaysTime1 = false"
              >
                Close
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                small
                @click="addSchedule()"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      <v-dialog
          v-model="dialogAddDaysTime2"
          width="700"
        >
          <v-card>
            <v-card-title class="headline primary">
              <span style="color: #fff;">Add Working Days and Time</span>
            </v-card-title>
            <v-card-text class="mt-4">
              <v-select
                :items="days"
                label="Select day..."
                outlined
                dense
                v-model="day_picked"
              ></v-select>
              <v-row v-if="day_picked">
                <v-col cols="12" sm="6">
                  <v-card-subtitle v-if="from_time">{{from_time}}</v-card-subtitle>
                  <v-btn outlined small color="primary" block @click="fromTime = true">From</v-btn>
                </v-col>
                <v-col cols="12" sm="6" v-if="from_time">
                  <v-card-subtitle v-if="to_time">{{to_time}}</v-card-subtitle>
                  <v-btn outlined small color="primary" block @click="toTime = true">To</v-btn>
                </v-col>
              </v-row>
            </v-card-text>

            <v-divider dark color="primary"></v-divider>
            <v-card-actions>
              <v-btn
                color="red"
                text
                small
                @click="dialogAddDaysTime2 = false"
              >
                Cancel
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                v-if="to_time"
                color="primary"
                text
                small
                @click="addDayTime"
              >
                Add
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog
          v-model="fromTime"
          width="350"
        >
        <v-time-picker
          v-model="from_time"
          ampm-in-title
        >
        <v-btn v-if="from_time" small block outlined @click="fromTime = false" dark color="primary">Ok</v-btn>
        </v-time-picker>
        </v-dialog>

        <v-dialog
          v-model="toTime"
          width="350"
        >
        <v-time-picker
          v-model="to_time"
          ampm-in-title
        >
        <v-btn v-if="to_time" small block outlined @click="toTime = false" dark color="primary">Ok</v-btn>
        </v-time-picker>
        </v-dialog>

        <v-dialog
          v-model="dialogAddDaysTime3"
          width="700"
        >
          <v-card>
            <v-card-title class="headline primary">
              <span style="color: #fff;">Edit Working Days and Time</span>
            </v-card-title>
            <v-card-text class="mt-4">
              <v-select
                :items="days"
                label="Select day..."
                outlined
                dense
                v-model="selected_item_tobe_edited.day"
              ></v-select>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-card-subtitle>{{selected_item_tobe_edited.from}}</v-card-subtitle>
                  <v-btn outlined small color="primary" block @click="fromTimeEdit = true">From</v-btn>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-card-subtitle>{{selected_item_tobe_edited.to}}</v-card-subtitle>
                  <v-btn outlined small color="primary" block @click="toTimeEdit = true">To</v-btn>
                </v-col>
              </v-row>
            </v-card-text>

            <v-divider dark color="primary"></v-divider>
            <v-card-actions>
              <v-btn
                color="red"
                text
                small
                @click="dialogAddDaysTime3 = false"
              >
                Cancel
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                small
                @click="editDayTime"
              >
                Update
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog
          v-model="fromTimeEdit"
          width="350"
        >
        <v-time-picker
          v-model="selected_item_tobe_edited.from"
          ampm-in-title
        >
        <v-btn small block outlined @click="fromTimeEdit = false" dark color="primary">Ok</v-btn>
        </v-time-picker>
        </v-dialog>

        <v-dialog
          v-model="toTimeEdit"
          width="350"
        >
        <v-time-picker
          v-model="selected_item_tobe_edited.to"
          ampm-in-title
        >
        <v-btn small block outlined @click="toTimeEdit = false" dark color="primary">Ok</v-btn>
        </v-time-picker>
        </v-dialog>

</div>
</template>

<script>
import Vue from "vue";
import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);

  export default {
    middleware: ['auth', 'admin'],
    data: () => ({
      dialog: false,
      dialogChangingUserStatus: false,
      dialogSchedule: false,
      dialogConfirmDelete: false,
      search: '',
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Pin', value: 'pin' },
        { text: 'Email', value: 'email' },
        { text: 'Role', value: 'role' },
        { text: 'Department', value: 'department' },
        { text: 'Status', value: 'status' },
        { text: 'Created', value: 'created_at' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],

      users: [],
      departments: [],
      roles: [],
      deletedUser: '',

      editedIndex: -1,

      editedItem: {
        name: '',
        email: '',
        pin: '',
        password: '',
        role_id: '',
        department_id: ''
      },

      defaultItem: {
        name: '',
        email: '',
        pin: '',
        password: '',
        role_id: '',
        department_id: ''
      },

      dialogAddDaysTime1: false,
      dialogAddDaysTime2: false,
      selected_user: "",
      days: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      days_time: [],
      day_picked: "",
      fromTime: false,
      from_time: "",
      toTime: false,
      to_time: "",
      selected_item_tobe_edited: "",
      dialogAddDaysTime3: false,
      fromTimeEdit: false,
      toTimeEdit: false,
      selected_item_tobe_edited_index: ""
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Create New User' : 'Edit User'
      },

      filteredData(){
          return this.users.filter((text) => {
            return  text.name.toLowerCase().includes(this.search.toLowerCase())
          })
        }
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    created () {
      this.fetchUsers()
      this.fetchRoles()
      this.fetchDepartments()
    },

    methods: {
      back(){
        this.$router.back();
      },

      checkSchedule(x){
        if(x){
          x = JSON.parse(x)
        } else {
          x = []
        }

        return x
      },

      convertTimer(x){
        let timeString = x;
        let H = +timeString.substr(0, 2);
        let h = H % 12 || 12;
        let ampm = (H < 12 || H === 24) ? "AM" : "PM";
        timeString = h + timeString.substr(2, 3) + ampm;

        return timeString
      },

      fetchUsers(){
        this.$axios.get(`/users`)
           .then(response => {
             let array = response.data.data.filter(val => {
               return val.id !== 1;
             });

             array.forEach(val => {
               let data = {
                 id: val.id,
                 name: val.name,
                 email: val.email,
                 role: val.role,
                 department: val.department,
                 pin: val.pin,
                 status: val.status,
                 schedule: this.checkSchedule(val.schedule),
                 created_at: val.created_at,
               }

               this.users.push(data)
             })
           })
           .catch(error => {
             console.log(error.data);
           })
        },

        editSelectedItem(index){
          let item = this.selected_user.schedule[index]
          this.selected_item_tobe_edited = item
          this.selected_item_tobe_edited_index = index
          this.dialogAddDaysTime3 = true
        },

        deleteSelectedItem(index){
          this.selected_user.schedule.splice(index, 1)
        },
        
        editDayTime(){
          this.selected_user.schedule[this.selected_item_tobe_edited_index] = this.selected_item_tobe_edited
          this.dialogAddDaysTime3 = false
        },

        fetchRoles(){
        this.$axios.get(`/roles`)
           .then(response => {
             this.roles = response.data.data;
           })
           .catch(error => {
             console.log(error.data);
           })
        },

        fetchDepartments(){
        this.$axios.get(`/departments`)
           .then(response => {
             this.departments = response.data.data;
           })
           .catch(error => {
             console.log(error.data);
           })
        },

      editItem (item) {
        this.editedIndex = this.users.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      confirmDelete(item){
        this.dialogConfirmDelete = true
        this.deletedUser = item
      },

      deleteItem(item){
        const index = this.users.indexOf(item)

        let delete_user = this.$axios.delete(`/users/${item.id}`)
           .then(response => {
             this.dialogConfirmDelete = false
             this.$toast.success(`${item.name} deleted`, {
               duration: 1000
             })
             this.users.splice(index, 1)
           }).catch(error => { console.log(error)})
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      openDialogAddDaysTime1(item){
        this.dialogAddDaysTime1 = true
        this.selected_user = item
      },

      openDialogAddDaysTime2(){
        this.dialogAddDaysTime2 = true
      },

      addDayTime(){
        let data = {
          day: this.day_picked,
          from: this.from_time,
          to: this.to_time
        }

        this.selected_user.schedule.push(data)
        this.dialogAddDaysTime2 = false
      },

      switchStatus(item){
        this.dialogChangingUserStatus = true
        if(item.status === 0){
          item.status = 1
        } else {
          item.status = 0
        }

        let data = {
          status: item.status
        }

        this.$axios.post(`/users_switch_status/${item.id}`, data).then(res => {
          this.dialogChangingUserStatus = false
        })
      },

      addSchedule(){
        this.dialogSchedule = true
        
        let data = {
          schedule: JSON.stringify(this.selected_user.schedule)
        }

        this.$axios.post(`/users_schedule/${this.selected_user.id}`, data).then(res => {
          this.dialogAddDaysTime1 = false
          this.dialogSchedule = false
        })
      },

      save () {
        if (this.editedIndex > -1) {
              Object.assign(this.users[this.editedIndex], this.editedItem)
          this.$axios.patch(`/users/${this.editedItem.id}`, {
            name: this.editedItem.name,
            email: this.editedItem.email,
            role_id: this.editedItem.role_id,
            department_id: this.editedItem.department_id,
            pin: this.editedItem.pin,
            password: this.editedItem.password,
            pwd_clr: this.editedItem.password
          })
           .then(response => {
             this.$toast.success(`User edited`, {
               duration: 1000
             })
            this.close()
              // Object.assign(this.users[this.editedIndex], this.editedItem)
           }).catch(error => {
             this.$toast.error(`There was an error. Ensure all fields are filled`, {
               duration: 2000
             })
            })
        } else {

          let data2 = {
            name: this.editedItem.name,
            email: this.editedItem.email,
            role_id: this.editedItem.role_id,
            department_id: this.editedItem.department_id,
            pin: this.editedItem.pin,
            password: this.editedItem.password,
            pwd_clr: this.editedItem.password
          }
          // console.log(data2)
          this.$axios.post(`/users`, data2)
           .then(response => {
             this.$toast.success(`New User created`, {
               duration: 1000
             })
             this.users.push(response.data.data)
             this.close()
           }).catch(error => {
             this.$toast.error(`There was an error. Ensure all fields are filled`, {
               duration: 2000
             })
            })
          // this.users.push(this.editedItem)
        }
      },
    },
  }
</script>
