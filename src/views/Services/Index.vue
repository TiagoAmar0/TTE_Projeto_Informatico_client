<template>
  <DashboardLayout>
    <h1 class="is-size-3">Services</h1>
    <hr>
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
