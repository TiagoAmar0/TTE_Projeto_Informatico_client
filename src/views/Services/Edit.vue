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
          <button :disabled="processing" :class="{ 'is-loading': processing }" class="button is-primary mr-2">Atualizar</button>
          <button :disabled="processing" class="button is-primary is-light mb-4" @click="$router.push({ name: 'services' })">
            Cancelar
          </button>
        </div>
      </div>
    </form>
    <hr>
    <h1 class="is-size-4 mb-2">Enfermeiros</h1>
    <service-nurses-table :nurses="service.users" @disassociate="disassociate"  :processing="processing"/>
    <hr>
    <h1 class="is-size-4 mb-2">Associar enfermeiros</h1>
    <associate-nurse-table :nurses="service.nursesWithoutService" @associate="associate" :processing="processing"/>
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
      processing: false,
      service: {
        id: null,
        name: '',
        users: [],
        nursesWithoutService: []
      }
    }
  },
  mounted(){
    this.processing = true
    const id = this.$route.params.id

    axios.get(`/services/${id}`)
        .then(response => {
          this.service = response.data.data
        })
        .catch(error => console.log(error))
        .finally(() => {
          this.processing = false
        })

  },
  methods: {
    disassociate(userId){
      this.processing = true
      this.$store.dispatch('disassociateUserToService', { service: this.$route.params.id, user: userId})
          .then((response) => {
            this.$toast.success(response.message)
            this.service = response.data.service
          })
          .catch(error => {
            if(error.hasOwnProperty('response'))
              this.$toast.error(error.response.data.message)
          })
          .finally(() => {
            this.processing = false
          })
    },
    associate(userId){
      this.processing = true
      this.$store.dispatch('associateUserToService', { service: this.$route.params.id, user: userId})
          .then((response) => {
            this.$toast.success(response.message)
            this.service = response.data.service
          })
          .catch(error => {
            if(error.hasOwnProperty('response'))
              this.$toast.error(error.response.data.message)
          })
          .finally(() => {
            this.processing = false
          })
    },
    update(){
      this.processing = true
      this.$store.dispatch('updateService', this.service)
          .then(() => {
            this.$toast.success('O serviço foi atualizado')
            this.$router.push({ name: 'service.show', params: { id: this.$route.params.id } })
          })
          .catch(error => {
            if(error.hasOwnProperty('response'))
              this.$toast.error(error.response.data.message)
          })
          .finally(() => {
            this.processing = false
          })
    }
  },
}
</script>
