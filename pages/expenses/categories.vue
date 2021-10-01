<template>
  <div>
    <ExpenseCategories />
  </div>
</template>

<script>
import ExpenseCategories from "~/components/ExpenseCategories"

export default {
  middleware: ['auth'],

  components: {
    ExpenseCategories
  }
}
</script>

<style>

</style>
