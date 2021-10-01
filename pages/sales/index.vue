<template>
  <div>
    <Sales />
  </div>
</template>

<script>
import Sales from "~/components/Sales"

export default {
  middleware: ['auth'],

  components: {
    Sales
  }
}
</script>

<style>

</style>
