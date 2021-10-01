<template>
  <div>
    <Bills />
  </div>
</template>

<script>
import Bills from "~/components/Bills"

export default {
  middleware: ['auth'],

  components: {
    Bills
  }
}
</script>

<style>

</style>
