<template>
  <DashboardLayout title="Dashboard">
    <h1 class="is-size-4">Permissões: {{ user.type_normalized }}</h1>
    <hr>
    <swaps-proposed-by-user-table />
  </DashboardLayout>
</template>

<script>
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import SwapsProposedByUserTable from "@/components/Swaps/SwapsProposedByUserTable.vue";

export default {
  components: {SwapsProposedByUserTable, DashboardLayout},
  layout: 'dashboard',
  computed: {
    user(){
      return this.$store.getters.authUser
    }
  },
}
</script>
