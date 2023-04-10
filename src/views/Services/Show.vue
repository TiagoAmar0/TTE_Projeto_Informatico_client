<template>
  <DashboardLayout :title="service.name">
    <h1 class="is-size-4 mb-2">Enfermeiros ({{ service.users.length }}):</h1>
    <RouterLink :to="{ name: 'services' }">
      <button class="button is-primary is-light mb-4 mr-2">
        Voltar
      </button>
    </RouterLink>
    <RouterLink :to="{ name: 'service.edit', params: { id: $route.params.id }}" >
      <button class="button is-primary">
        Editar Serviço
      </button>
    </RouterLink>
    <service-nurses-table :nurses="service.users" @disassociate="disassociate"/>
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
  methods: {
    disassociate(userId){
      this.$store.dispatch('disassociateUserToService', { service: this.$route.params.id, user: userId})
          .then((response) => {
            this.$toast.success(response.message)
            this.service = response.data.service
          })
          .catch(error => {
            if(error.hasOwnProperty('response'))
              this.$toast.error(error.response.data.message)
          })
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
