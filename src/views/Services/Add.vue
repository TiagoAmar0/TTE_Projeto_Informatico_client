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
          <button :disabled="processing" :class="{ 'is-loading': processing }" type="submit" class="button is-primary mr-2">Adicionar</button>
          <button :disabled="processing" class="button is-primary is-light mb-4" @click="$router.push({ name: 'services' })">
            Cancelar
          </button>
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
      processing: false,
      form: {
        name: ''
      }
    }
  },
  methods: {
    store(){
      this.processing = true
      this.$store.dispatch('storeService',this.form)
          .then(response => {
            this.$toast.success('O serviço foi adicionado')
            this.$router.push({ name: 'service.edit', params: { id: response.id }})
          })
          .catch(error => {
            if(error.hasOwnProperty('response'))
              this.$toast.error(error.response.data.message)
          })
          .finally(() => {
            this.processing = false
          })
    }
  }
}
</script>
