<template>
  <DashboardLayout title="Adicionar Turno">
    <form @submit.prevent="update">
      <div class="field">
        <label class="label">Abreviatura</label>
        <div class="control">
          <input class="input" type="text" v-model="form.name" />
        </div>
      </div>
      <div class="field">
        <label class="label">Descrição</label>
        <div class="control">
          <input class="input" type="text" v-model="form.description" />
        </div>
      </div>
      <div class="field">
        <label class="label">Início</label>
        <div class="control">
          <input class="input" v-maska data-maska="##:##" v-model="form.start">
        </div>
      </div>
      <div class="field">
        <label class="label">Fim</label>
        <div class="control">
          <input class="input" v-maska data-maska="##:##" v-model="form.end">
        </div>
      </div>
      <div class="field">
        <label class="label">Nº de Enfermeiros</label>
        <div class="control">
          <input type="number" class="input" v-model="form.nurses_qty">
        </div>
      </div>
      <div class="field">
        <div class="control">
          <button :class="{ 'is-loading': processing }" :disabled="processing" type="submit" class="button is-primary mr-2">Adicionar</button>
          <button :disabled="processing" class="button is-primary is-light mb-4" @click="$router.push({ name: 'service.shifts' })">
            Cancelar
          </button>
        </div>
      </div>
    </form>
  </DashboardLayout>
</template>

<script>
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import axios from "axios";

export default {
  name: 'service-shifts-edit',
  components: { DashboardLayout },
  data(){
    return {
      processing: false,
      form: {
        name: '',
        description: '',
        start: '00:00',
        end: '00:00',
        nurses_qty: 0,
      }
    }
  },
  methods: {
    update(){
      this.processing = true
      axios.put(`/services/${this.$route.params.id}/shifts/${this.$route.params.shift}`, this.form)
          .then((response) => {
            this.$toast.success(response.data.message)
            this.$router.push({ name: 'service.shifts', params: { id: this.$route.params.id }})
          })
          .catch(error => {
            this.$toast.error(error.response.data.message)
          })
          .finally(() => {
            this.processing = false
          })
    },

  },
  mounted(){
    this.processing = true;
    axios.get(`/services/${this.$route.params.id}/shifts/${this.$route.params.shift}`)
        .then((response) => {
          this.form = response.data.data
          this.processing = false
        })
        .catch(error => {
          this.$toast.error(error.response.data.message)
        })
  }
}
</script>
