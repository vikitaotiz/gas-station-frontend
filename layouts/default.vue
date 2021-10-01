<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      width="170"
    >
    <v-list dense>
       <v-list-item class="pb-1">
        <v-list-item-content>
          <v-list-item-title class="title">
            Point of Sale
          </v-list-item-title>
          <v-list-item-subtitle>
            <code>version 0.3</code>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider color="orange"></v-divider>

      <div v-if="isAuthenticated">
        <v-list-item link :to="{name: 'dashboard'}" exact color="primary">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title >Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{name: 'settings'}" exact color="primary">
          <v-list-item-action>
            <v-icon>mdi-cog-sync</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title >Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </div>

      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="isAuthenticated"></v-app-bar-nav-icon>
      <v-toolbar-title>GAS POS</v-toolbar-title>

      <v-spacer></v-spacer>

     <div v-if="isAuthenticated">
          <span class="desktop_feature">
            <v-icon>mdi-account</v-icon>
            {{ loggedInUser.data.name }}</span>
          <v-tooltip bottom color="orange">
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" @click="logout" class="desktop_feature">
                <v-icon>mdi-logout-variant</v-icon>
              </v-btn>
            </template>
            <span>Logout</span>
          </v-tooltip>
          
          <v-menu
            left
            bottom
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
                class="d-md-none mobile_feature"
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list class="d-md-none mobile_feature">
              <v-list-item>
                  <v-icon class="mr-1">mdi-account</v-icon> {{ loggedInUser.data.name }}
                </v-list-item>
              <v-list-item>
                  <v-btn @click="logout" small dark color="orange" block>
                    <v-icon>mdi-logout-variant</v-icon> Logout
                  </v-btn>
              </v-list-item>
            </v-list>
          </v-menu>
      </div>

      <div v-if="!isAuthenticated">
        <small>Point of Sale</small>
        <br><small><code>version 0.3</code></small>
      </div>

    </v-app-bar>

    <v-main style="background: #d9e7fc;">
      <v-container>
        <nuxt />
      </v-container>
    </v-main>

    <v-bottom-navigation
      horizontal
    >
        <v-card-subtitle>
          <span>GAS POS &copy; {{new Date().getFullYear()}}. All rights reserved.</span>
        </v-card-subtitle>

    </v-bottom-navigation>

  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

  export default {
    computed: {
        ...mapGetters(['isAuthenticated', 'loggedInUser', 'isAdmin', 'isCashier'])
      },

    data: () => ({
      drawer: false,
    }),

    methods: {
      async logout() {
        this.drawer = false;
        this.$auth.logout()
        this.$toast.show('Logged out...', {
            duration: 1000
        })
        
        this.$router.push('/');
      }
    }
  }
</script>

<style scoped>
  @media only screen and (max-width: 768px) {
    .desktop_feature {
      display: none;
    }

    .mobile_features {
      display: inline;
    }
  }
</style>
