<template>
  <div>
    <v-row>
      <v-col cols="12" sm="8">
        <v-card
        class="mx-auto text-center"
        color="primary"
        dark
        max-width="700"
        style="height: 280px;"
      >
          <v-sheet color="rgba(0, 0, 0, .12)">
            <v-sparkline
              :value="value"
              color="rgba(255, 255, 255, .7)"
              padding="13"
              stroke-linecap="round"
              smooth
            >
              <template v-slot:label="item">
                ${{ item.value }}
              </template>
            </v-sparkline>
          </v-sheet>

        <v-divider></v-divider>
          <div class="text-h6 font-weight-thin">
            Sales Last 24h
          </div>
        <v-divider></v-divider>

        <v-card-actions class="justify-center">
          <v-btn
            block
            text
            small
          >
            Go to Report
          </v-btn>
        </v-card-actions>
      </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card dark color="primary" class="pa-3 mb-2 font-weight-thin">Today's Sales</v-card>
        <v-card dark color="primary" class="pa-3 mb-2 font-weight-thin">Today's Sales</v-card>
        <v-card dark color="primary" class="pa-3 mb-2 font-weight-thin">Today's Sales</v-card>
        <v-card dark color="primary" class="pa-3 mb-2 font-weight-thin">Today's Sales</v-card>
        <v-card dark color="primary" class="pa-3 font-weight-thin">Today's Sales</v-card>
      </v-col>
    </v-row>
    <v-divider dark color="primary"></v-divider>
    <v-row>
      <v-col cols="12" sm="3">
        <v-card dark color="primary" class="pa-3">
          Cash
        </v-card>
      </v-col>
      <v-col cols="12" sm="3">
        <v-card dark color="primary" class="pa-3">
          Cash
        </v-card>
      </v-col>
      <v-col cols="12" sm="3">
        <v-card dark color="primary" class="pa-3">
          Cash
        </v-card>
      </v-col>
      <v-col cols="12" sm="3">
        <v-card dark color="primary" class="pa-3">
          Cash
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data: () => ({
    value: [
        423,
        446,
        675,
        510,
        590,
        610,
        760,
        760,
        760,
        760,
      ]
  })
}
</script>

<style>

</style>