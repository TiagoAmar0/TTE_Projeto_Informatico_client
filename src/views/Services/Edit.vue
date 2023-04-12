<template>
  <DashboardLayout title="Editar Serviço">
    <form @submit.prevent="update">
      <div class="field">
        <label class="label">Nome</label>
        <div class="control">
          <input class="input" type="text" v-model="service.name" />
        </div>
      </div>
      <div class="field">
        <div class="control">
          <button class="button is-primary mr-2">Atualizar</button>
          <RouterLink :to="{ name: 'services' }">
            <button class="button is-primary is-light mb-4">
              Cancelar
            </button>
          </RouterLink>
        </div>
      </div>
    </form>
    <hr>
    <h1 class="is-size-4 mb-2">Enfermeiros</h1>
    <service-nurses-table :nurses="service.users" @disassociate="disassociate"/>
    <hr>
    <h1 class="is-size-4 mb-2">Associar enfermeiros</h1>
    <associate-nurse-table :nurses="nursesWithoutService" @associate="associate" />
  </DashboardLayout>
</template>

<script>
import axios from "axios";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import AssociateNurseTable from "@/components/Services/AssociateNurseTable.vue";
import ServiceNursesTable from "@/components/Services/NursesTable.vue";

export default {
  name: 'service-edit',
  components: {ServiceNursesTable, AssociateNurseTable, DashboardLayout },
  data(){
    return {
      service: {
        id: null,
        name: '',
        users: []
      }
    }
  },
  mounted(){
    const id = this.$route.params.id

    axios.get(`/services/${id}`)
        .then(response => {
          this.service = response.data.data
        })
        .catch(error => console.log(error))
  },
  computed: {
    nursesWithoutService(){
      return this.$store.getters.usersWithoutService
    },
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
    },
    associate(userId){
      this.$store.dispatch('associateUserToService', { service: this.$route.params.id, user: userId})
          .then((response) => {
            this.$toast.success(response.message)
            this.service = response.data.service
          })
          .catch(error => {
            if(error.hasOwnProperty('response'))
              this.$toast.error(error.response.data.message)
          })
    },
  },
  update(){
    this.$store.dispatch('updateService', this.service)
        .then(() => {
          this.$toast.success('O serviço foi atualizado')
          this.$router.push({ name: 'service.show', params: { id: this.$route.params.id } })
        })
        .catch(error => {
          if(error.hasOwnProperty('response'))
            this.$toast.error(error.response.data.message)
        })
  }
}
</script>
