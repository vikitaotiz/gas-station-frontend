<template>
  <div>
    <Dashboard />
  </div>
</template>

<script>
import Dashboard from '~/components/Dashboard'

export default {
  middleware: ['auth'],

  data(){
    return {
      online_users: ''
    }
  },

  components: {
    Dashboard
  }
}
</script>
