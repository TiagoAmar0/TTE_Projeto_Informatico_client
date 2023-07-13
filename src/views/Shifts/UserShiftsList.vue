<template>
  <DashboardLayout title="O meu horário">
    <VueDatePicker
        v-model="date"
        format="dd-MM-yyyy"
        :week-picker="true"
        locale="pt-PT"
        week-numbers="local"
        auto-apply
        :min-date="minDate"
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
            <button class="button is-primary is-small" v-if="shift.shift !== 'Folga' && !shift.isPast"
              @click="$router.push({ name: 'swaps.propose', query: { 'date': shift.dateString }})"
            >
              Pedir Troca
            </button>
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
      days_of_the_week: ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sáb.'],
      months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    }
  },
  computed: {
    minDate(){
      let today = new Date()
      let dayOfTheWeek = today.getDay()
      let daysToSubtract = dayOfTheWeek === 0 ? 6 : dayOfTheWeek - 1

      return new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysToSubtract)
    },
    userShifts(){
      if(!this.date || !this.$store.state.user || !this.$store.state.user.shifts || !this.$store.state.user.shifts.length)
        return [];


      const startDate = this.date[0]
      const endDate = this.date[1]

      const shifts = this.$store.state.user.shifts.filter(s => {
        return this.parseDate(s.date) >= startDate && this.parseDate(s.date) <= endDate
      });

      if(!shifts)
        return

      let dates = [];
      const controlDate = new Date(startDate.getTime())
      while(controlDate <= endDate){
        dates.push(this.formatDate(controlDate))
        controlDate.setDate(controlDate.getDate() + 1);
      }

      return dates.map(date => {

        const parsedDate = this.parseDate(date)

        const dayName = this.days_of_the_week[parsedDate.getDay()]
        const monthName = this.months[parsedDate.getMonth()]
        const day = parsedDate.getDate()

        console.log(parsedDate, parsedDate >= new Date().setHours(0,0,0))

        const shift = shifts.find(s => s.date === date)
        if(shift){
          return {
            date: `${dayName} ${day} ${monthName}`,
            shift: shift.shift.description,
            dateString: date,
            isPast: parsedDate.setHours(0,0,0) <= new Date().setHours(0,0,0)
          }
        }

        return {
          date: `${dayName} ${day} ${monthName}`,
          shift: 'Folga',
          dateString: date,
          isPast: parsedDate.setHours(0,0,0) <= new Date().setHours(0,0,0)
        }
      })
    }
  },
  methods: {
    parseDate(dateString){
      const [day, month, year] = dateString.split('/');
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
    const today = new Date();

    const diff = today.getDay() - 1;

    const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - diff);

    const lastDayOfWeek = new Date(today.getFullYear(), today.getMonth(), firstDayOfWeek.getDate() + 6);

    this.date = [firstDayOfWeek, lastDayOfWeek];
  }
}
</script>

<style>
.list-item-description{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
