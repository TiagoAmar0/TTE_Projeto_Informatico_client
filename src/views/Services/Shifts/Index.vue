<template>
  <DashboardLayout title="Turnos do Serviço">
    <button class="button is-secondary mx-1 mb-4" @click="$router.push({ name: 'services' })">
      Voltar
    </button>
    <button class="button is-primary mx-1 mb-4" @click="$router.push({ name: 'service.shifts.add' })">
      Adicionar Turno
    </button>
    <ServiceShiftsTable :shifts="shifts" @reload="loadShifts" />
  </DashboardLayout>
</template>

<script>
import axios from "axios";
import ServiceShiftsTable from "@/components/Services/Shifts/ShiftTable.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";

export default {
  name: 'service-shifts-index',
  components: { ServiceShiftsTable, DashboardLayout },
  data() {
    return {
      shifts: []
    }
  },
  methods: {
    loadShifts(){
      const service_id = this.$route.params.id

      // Get schedule
      axios.get(`/services/${service_id}/shifts`)
          .then(response => {
            this.shifts = response.data.data
          })
          .catch(error => {
            this.$toast.error('Erro a carregar turnos')
          })
    }
  },
  mounted() {
    this.loadShifts()
  }
}
</script>
