<template>
  <DashboardLayout title="Editar Utilizador">
    <form @submit.prevent="update">
      <div class="field">
        <label class="label">Nome</label>
        <div class="control">
          <input class="input" type="text" v-model="user.name" />
        </div>
      </div>
      <div class="field">
        <label class="label">Email</label>
        <div class="control">
          <input class="input" type="text" v-model="user.email" />
        </div>
      </div>
      <div class="field">
        <label class="label">Tipo</label>
        <div class="control">
          <div class="select" :style="{width: '100%'}">
            <select v-model="user.type"  :style="{width: '100%'}">
              <option v-for="type in userTypes" :value="type.value">{{ type.text }}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <button type="submit" class="button is-primary mr-2">Atualizar</button>
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
import axios from "axios";
import DashboardLayout from "@/layouts/DashboardLayout.vue";

export default {
  name: 'user-edit',
  components: { DashboardLayout },
  data(){
    return {
      user: {
        id: null,
        name: null,
        email: null,
        service: null,
        service_id: null,
        type: null,
        type_normalized: null,
      },
      userTypes: [
        { value: 'admin', text: 'Administrador' },
        { value: 'lead-nurse', text: 'Enfermeiro Chefe' },
        { value: 'nurse', text: 'Enfermeiro' },
      ]
    }
  },
  mounted(){
    const id = this.$route.params.id

    axios.get(`/users/${id}`)
        .then(response => {
          this.user = response.data.data
        })
        .catch(error => console.log(error))
  },
  methods: {
    update(){
      this.$store.dispatch('updateUser', this.user)
          .then(() => {
            this.$toast.success('O utilizador foi atualizado')
            this.$router.push({ name: 'user.show', params: { id: this.$route.params.id } })
          })
          .catch(error => {
            if(error.hasOwnProperty('response'))
              this.$toast.error(error.response.data.message)
          })
    }
  }
}
</script>
