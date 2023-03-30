<template>
  <DashboardLayout title="Adicionar Serviço">
    <form @submit.prevent="store">
      <div class="field">
        <label class="label">Nome</label>
        <div class="control">
          <input class="input" type="text" v-model="form.name" />
        </div>
      </div>
      <div class="field">
        <div class="control">
          <button class="button is-primary mr-2">Adicionar</button>
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
import DashboardLayout from "@/layouts/DashboardLayout.vue"

export default {
  name: 'services-add',
  components: { DashboardLayout },
  data(){
    return {
      form: {
        name: ''
      }
    }
  },
  methods: {
    store(){
      this.$store.dispatch('storeService',this.form)
          .then(() => {
            this.$toast.success('O serviço foi adicionado')
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
