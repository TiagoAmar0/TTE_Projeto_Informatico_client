<template>
  <DashboardLayout :title="'Serviços (' + $store.getters.servicesTotal + ')'">
    <RouterLink :to="{ name: 'services.add' }">
      <button class="button is-primary mb-4">
        Adicionar Serviço
      </button>
    </RouterLink>
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
