<template>
  <DashboardLayout title="Os meus turnos">
    <VueDatePicker
        v-model="date"
        format="dd-MM-yyyy"
        :week-picker="true"
        locale="pt-PT"
        week-numbers="local"
        auto-apply
        :close-on-auto-apply="true"
        :enable-time-picker="false"
    />

    <div v-if="date" class="list has-hoverable-list-items has-overflow-ellipsis">
      <div class="list-item" v-for="shift in userShifts">
        <div class="list-item-content">
          <div class="list-item-title is-flex is-justify-content-space-between">
            <span>{{ shift.date }}</span>
          </div>
          <div class="list-item-description">
            {{ shift.shift }}
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script>

import DashboardLayout from "@/layouts/DashboardLayout.vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import 'bulma-list/css/bulma-list.css'

export default {
  name: 'user-shifts-list',
  components: { DashboardLayout, VueDatePicker},
  data(){
    return {
      date: null,
    }
  },
  computed: {
    userShifts(){
      if(!this.date || !this.$store.state.user || !this.$store.state.user.shifts || !this.$store.state.user.shifts.length)
        return [];


      const start_date = this.date[0]
      const end_date = this.date[1]

      const shifts = this.$store.state.user.shifts.filter(s => {
        return this.parseDate(s.date) >= start_date && this.parseDate(s.date) <= end_date
      });

      if(!shifts)
        return

      let dates = [];
      const iterator_date = new Date(start_date.getTime())
      while(iterator_date <= end_date){
        dates.push(this.formatDate(iterator_date))
        iterator_date.setDate(iterator_date.getDate() + 1);
      }

      return dates.map(date => {
        const shift = shifts.find(s => s.date === date)
        if(shift){
          return {
            date: date,
            shift: shift.shift.description
          }
        }

        return {
          date: date,
          shift: 'Folga'
        }
      })
    }
  },
  methods: {
    parseDate(date_string){
      const [day, month, year] = date_string.split('/');
      return new Date(`${year}-${month}-${day}`);
    },
    formatDate(date){
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
  },
  mounted() {
    // Obtém a data atual
    const today = new Date();


    // Calcula a diferença entre o dia atual e o dia da semana de segunda-feira
    const diff = today.getDay() - 1;

    // Obtém o primeiro dia da semana atual (segunda-feira)
    const first_day_of_week = new Date(today.getFullYear(), today.getMonth(), today.getDate() - diff);

    // Obtém o último dia da semana atual (domingo)
    const last_day_of_week = new Date(today.getFullYear(), today.getMonth(), first_day_of_week.getDate() + 6);

    this.date = [first_day_of_week, last_day_of_week];
  }
}
</script>
