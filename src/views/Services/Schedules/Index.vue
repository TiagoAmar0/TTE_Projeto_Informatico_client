<template>
  <DashboardLayout title="Horários">

    <button class="button is-primary is-light mx-1 mb-4" @click="$router.push({ name: 'services' })">
      Voltar
    </button>

    <button class="button is-primary mx-1 mb-4" @click="$router.push({ name: 'service.schedules.add', params: { id: $route.params.id }})">
      Adicionar Horário
    </button>

    <SchedulesTable :schedules="schedules" @reload="reload" />

  </DashboardLayout>
</template>

<script>
import DashboardLayout from "@/layouts/DashboardLayout.vue"
import axios from "axios";
import SchedulesTable from "@/components/Services/SchedulesTable.vue";

export default {
  name: 'service-schedules',
  components: {SchedulesTable, DashboardLayout },
  data(){
    return {
      schedules: []
    }
  },
  methods: {
    reload(){
      this.schedules = []
      axios.get(`/services/${this.$route.params.id}/schedules`)
          .then(response => {
            this.schedules = response.data.data
          })
          .catch(error => console.log(error))
    }
  },
  mounted(){
    this.reload()
  }
}
</script>
