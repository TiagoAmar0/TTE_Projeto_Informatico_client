<template>
  <DashboardLayout title="Adicionar Utilizador">
    <form @submit.prevent="store">
      <div class="field">
        <label class="label">Nome</label>
        <div class="control">
          <input class="input" type="text" v-model="form.name" />
        </div>
      </div>
      <div class="field">
        <label class="label">Email</label>
        <div class="control">
          <input class="input" type="text" v-model="form.email" />
        </div>
      </div>
      <div class="field">
        <label class="label">Password</label>
        <div class="control">
          <input class="input" type="password" v-model="form.password" />
        </div>
      </div>
      <div class="field">
        <label class="label">Tipo</label>
        <div class="control">
          <div class="select" :style="{width: '100%'}">
            <select v-model="form.type"  :style="{width: '100%'}">
              <option v-for="type in userTypes" :value="type.value">{{ type.text }}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <button class="button is-primary mr-2">Adicionar</button>
          <RouterLink :to="{ name: 'users' }">
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
        name: null,
        email: null,
        password: null,
        type: null
      },
      userTypes: [
        { value: 'admin', text: 'Administrador' },
        { value: 'lead-nurse', text: 'Enfermeiro Chefe' },
        { value: 'nurse', text: 'Enfermeiro' },
      ]
    }
  },
  methods: {
    store(){
      this.$store.dispatch('storeUser',this.form)
          .then(() => {
            this.$toast.success('O utilizador foi adicionado')
            this.$router.push({ name: 'users' })
          })
          .catch(error => {
            if(error.hasOwnProperty('response'))
              this.$toast.error(error.response.data.message)
          })
    }
  }
}
</script>
