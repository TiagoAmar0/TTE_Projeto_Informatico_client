<template>
  <DashboardLayout :title="'Serviços (' + $store.getters.servicesTotal + ')'">
    <button class="button is-primary mb-4" @click="$router.push({ name: 'services.add' })">
      Adicionar Serviço
    </button>
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
