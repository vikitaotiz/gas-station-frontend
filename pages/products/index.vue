<template>
  <div>
    <Products />
  </div>
</template>

<script>
import Products from "~/components/Products"

export default {
  middleware: ['auth'],

  components: {
    Products
  }
}
</script>

<style>

</style>
