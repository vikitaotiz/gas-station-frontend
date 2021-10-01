<template>
  <div>

    <v-card class="mt-5" style="width: 500px; margin: auto; border: 1px solid #827717;">
      <v-card-title><v-icon>mdi-account</v-icon> LOGIN</v-card-title>
      <v-divider dark color="primary"></v-divider>
                <v-col>
                  <v-text-field
                    dense
                    label="Email"
                    outlined
                    v-model="email"
                  ></v-text-field>

                  <v-text-field
                    dense
                    label="Password"
                    type="password"
                    outlined
                    v-model="password"
                  ></v-text-field>

                  <v-btn block depressed color="primary" @click="login" dark><v-icon small>mdi-lock-open</v-icon> Login</v-btn>

                </v-col>
              </v-card>

  </div>
</template>

<script>
  export default {
    data () {
      return {
        password: 'VIKITA1994',
        email: 'vikita@email.com',
      }
    },

    methods: {

      async login() {
          try {
            this.$toast.show('Logging in...', {
              duration: 1000,
            })

            await this.$auth.loginWith('local', {
              data: {
                email: this.email,
                password: this.password
              }
            })

            this.$toast.success('Successfully authenticated', {
              duration: 1000
            })

            this.$router.replace('/dashboard')

          } catch (e) {
            this.$toast.error('Authentication failed', {
              duration: 2000
            })
          }
        }
    }

  }
</script>
