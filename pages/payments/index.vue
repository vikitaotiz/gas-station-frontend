<template>
  <div>
    <Payments />
  </div>
</template>

<script>
import Payments from "~/components/Payments"

export default {
  middleware: ['auth'],

  components: {
    Payments
  }
}
</script>

<style>

</style>
