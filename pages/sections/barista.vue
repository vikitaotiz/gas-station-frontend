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
              <h3 style="color: black;">Barista Orders</h3>
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
              v-for="(cart, index) in props.items"
              :key="index"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card outlined style="border: 1px solid #827717;">
                <div>
                  <v-row class="pa-2">
                    <v-col cols="10"
                      ><b> {{ cart.bill }}</b></v-col
                    >
                  </v-row>
                  <hr />
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
                        <tr
                          v-for="(prod, index) in cart.content"
                          :key="index"
                          :class="[!Number(prod.added) ? '' : 'addedItem']"
                        >
                          <td>{{ prod.title }}</td>
                          <td>
                            {{ prod.quantity }}
                          </td>
                          <td>{{ prod.selling_price }}</td>
                          <td>{{ prod.total_price_per_item }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </div>
                <br />
                <div>
                  <v-btn
                    block
                    depressed
                    tile
                    small
                    class="mb-1"
                    dark
                    color="primary"
                    @click="sendToCashier(cart)"
                  >
                    <v-icon color="white">mdi-check</v-icon> Cashier
                  </v-btn>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>
    </v-card>
  </div>
</template>

<script>
import moment from "moment";
export default {
  middleware: ["auth"],
  data() {
    return {
      carts: [],
      itemsPerPage: 4,
      search: "",

      bills: [],
      bill_id: "",
      selectedProduct: "",
      selectedCart: ""
    };
  },

  created() {
    this.fetchCarts();
  },

  methods: {
    fetchCarts() {
      this.$axios
        .get(`/barista`)
        .then(res => {
          this.carts = res.data.filter(val => {
            return val.content.length;
          });
        })
        .catch(error => {
          console.log(error.data);
        });
    },

    formatDate(date) {
      return moment(date).format("MMMM Do YYYY, h:mm a");
    },

    sendToCashier(item) {
      this.$axios.post("/send_to_cashier", item).then(res => {
        this.carts = [];
        this.fetchCarts();
        this.$toast.success("Bill sent to cashier successfully!", {
          duration: 2000
        });
      });
    }
  }
};
</script>

<style>
.addedItem {
  background: #25bcd6 !important;
  color: white !important;
}
</style>
