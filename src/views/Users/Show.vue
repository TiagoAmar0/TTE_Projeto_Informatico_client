<template>
  <DashboardLayout :title="'Utilizador: ' + user.name">
    <div class="field">
      <label class="label">Nome</label>
      <div class="control">
        <input class="input" type="text" :value="user.name" disabled/>
      </div>
    </div>

    <div class="field">
      <label class="label">Email</label>
      <div class="control">
        <input class="input" type="text" :value="user.email" disabled/>
      </div>
    </div>

    <div class="field">
      <label class="label">Serviço</label>
      <div class="control">
        <input class="input" type="text" :value="user.service ? user.service : 'nenhum'" disabled/>
      </div>
    </div>

    <div class="field">
      <label class="label">Tipo</label>
      <div class="control">
        <input class="input" type="text" :value="user.type_normalized" disabled/>
      </div>
    </div>

    <RouterLink :to="{ name: 'users' }">
      <button class="button is-primary is-light mb-4 mr-2">
        Voltar
      </button>
    </RouterLink>

  </DashboardLayout>
</template>

<script>
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import axios from "axios";
import ServiceNursesTable from "@/components/Services/NursesTable.vue";
export default {
  name: 'show-user',
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
      }
    }
  },
  methods: {

  },
  mounted() {
    const id = this.$route.params.id

    axios.get(`/users/${id}`)
        .then(response => {
          this.user = response.data.data
        })
        .catch(error => console.log(error))
  }
}
</script>
