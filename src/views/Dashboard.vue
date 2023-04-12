<template>
  <DashboardLayout title="Dashboard">
    <h1 class="is-size-4">Permissões: {{ user.type_normalized }}</h1>
  </DashboardLayout>
</template>

<script>
import DashboardLayout from "@/layouts/DashboardLayout.vue";

export default {
  components: {DashboardLayout},
  layout: 'dashboard',
  computed: {
    user(){
      return this.$store.getters.authUser
    }
  },
}
</script>
