<template>
  <DashboardLayout :title="service.name">
    <button class="button is-primary is-light my-3 mx-1" @click="$router.push({ name: 'services' })" v-if="$store.getters.authUserType === 'admin'">
      Voltar
    </button>
    <button class="button is-primary my-3 mx-1" @click="$router.push({ name: 'service.edit', params: { id: $route.params.id }})">
      Editar Serviço
    </button>
    <button class="button is-secondary my-3 mx-1" @click="$router.push({ name: 'service.schedules', params: { id: $route.params.id }})">
      Horários
    </button>
    <button class="button is-secondary my-3 mx-1" @click="$router.push({ name: 'service.shifts', params: { id: $route.params.id }})">
      Configurar Turnos
    </button>


    <h1 class="is-size-4 mb-2">Enfermeiros ({{ service.users.length }}):</h1>
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

    disassociate(userID){
      this.$store.dispatch('disassociateUserToService', { service: this.$route.params.id, user: userID})
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
