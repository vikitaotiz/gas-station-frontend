<template>
  <div>
    <Expenses />
  </div>
</template>

<script>
import Expenses from "~/components/Expenses"

export default {
  middleware: ['auth'],

  components: {
    Expenses
  }
}
</script>

<style>

</style>