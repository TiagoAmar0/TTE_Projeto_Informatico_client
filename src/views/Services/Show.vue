<template>
  <DashboardLayout :title="service.name">
    <h1 class="is-size-4 mb-2">Enfermeiros ({{ service.users.length }}):</h1>
    <RouterLink :to="{ name: 'service.associate_nurse', params: { id: $route.params.id }}" >
      <button class="button is-primary">
        Associar enfermeiro
      </button>
    </RouterLink>
    <service-nurses-table :nurses="service.users" />
  </DashboardLayout>
</template>

<script>
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import axios from "axios";
import ServiceNursesTable from "@/components/Services/NursesTable.vue";
export default {
  name: 'show-service',
  components: {ServiceNursesTable, DashboardLayout },
  data(){
    return {
      service: {
        id: null,
        name: null,
        users: []
      }
    }
  },
  mounted() {
    const id = this.$route.params.id

    axios.get(`/services/${id}`)
        .then(response => {
          this.service = response.data.data
        })
        .catch(error => console.log(error))
  }
}
</script>
