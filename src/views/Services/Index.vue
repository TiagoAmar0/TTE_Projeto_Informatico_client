<template>
  <DashboardLayout :title="'Serviços (' + $store.getters.servicesTotal + ')'">
    <ServicesTable />
  </DashboardLayout>
</template>


<script>
import DashboardLayout from "@/layouts/DashboardLayout.vue"
import ServicesTable from "@/components/Services/ServicesTable.vue";

export default {
  name: 'services-index',
  components: { ServicesTable, DashboardLayout },
}
</script>
