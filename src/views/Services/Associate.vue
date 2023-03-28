<template>
  <DashboardLayout title="Associar enfermeiros">
    <ul>
      <li v-for="nurse in nursesWithoutService">
        {{ nurse.name }}
      </li>
    </ul>
  </DashboardLayout>
</template>

<script>

import DashboardLayout from "@/layouts/DashboardLayout.vue";

export default {
  name: 'service-associate-nurses',
  components: { DashboardLayout },
  computed: {
    nursesWithoutService(){
      return this.$store.getters.usersWithoutService
    }
  }
}
</script>
