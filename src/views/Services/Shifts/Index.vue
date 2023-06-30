<template>
  <DashboardLayout title="Turnos do Serviço">
    <button class="button is-primary is-light mx-1 mb-4" @click="$router.back()">
      Voltar
    </button>
    <button class="button is-primary mx-1 mb-4" @click="$router.push({ name: 'service.shifts.add' })">
      Adicionar Turno
    </button>

    <article class="message is-warning" v-if="intervals.length">
      <div class="message-header">
        <p>Aviso:</p>
      </div>
      <div class="message-body">
        <p>As seguintes horas do dia não estão cobertas por horário:</p>
        <ul>
          <li v-for="interval in intervals">{{ `- ${interval[0]} a ${interval[1]}` }}</li>
        </ul>
      </div>
    </article>

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
      shifts: [],
      intervals: []
    }
  },
  methods: {
    loadShifts(){
      const service_id = this.$route.params.id

      // Get schedule
      axios.get(`/services/${service_id}/shifts`)
          .then(response => {
            this.shifts = response.data.shifts
            this.intervals = response.data.intervals
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
