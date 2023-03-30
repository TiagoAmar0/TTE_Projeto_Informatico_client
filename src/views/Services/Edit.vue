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
  </DashboardLayout>
</template>

<script>
import axios from "axios";
import DashboardLayout from "@/layouts/DashboardLayout.vue";

export default {
  name: 'service-edit',
  components: { DashboardLayout },
  data(){
    return {
      service: {
        id: null,
        name: ''
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
  methods: {
    update(){
      this.$store.dispatch('updateService', this.service)
          .then(() => {
            this.$toast.success('O serviço foi atualizado')
            this.$router.push({ name: 'services' })
          })
          .catch(error => {
            if(error.hasOwnProperty('response'))
              this.$toast.error(error.response.data.message)
          })
    }
  }
}
</script>
