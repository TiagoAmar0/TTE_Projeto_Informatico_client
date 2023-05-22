<template>
  <div class="card">
    <div class="card-content">
      <h1 class="is-size-4">Próximos turnos</h1>
        <FullCalendar :options="calendarOptions" />
    </div>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'

export default {
  name: 'shifts-calendar',
  components: { FullCalendar },
  data(){
    return {
      // calendarOptions: {
      //   events: this.userShifts,
      //   timezone: 'GMT',
      //   plugins: [ dayGridPlugin ],
      //   initialView: 'dayGridMonth'
      // }
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
  computed: {
    calendarOptions(){
      return {
        timezone: 'GMT',
        plugins: [ dayGridPlugin ],
        initialView: 'dayGridMonth',
        events: this.userShifts
      }
    },
    userShifts(){
      if(!this.$store.state.user || !this.$store.state.user.shifts || !this.$store.state.user.shifts.length)
        return [];

      const shifts = this.$store.state.user.shifts;
      const start_date = this.parseDate(this.$store.state.user.shifts[0].date)
      const end_date = this.parseDate(this.$store.state.user.shifts[this.$store.state.user.shifts.length - 1].date)

      let dates = [];
      const iterator_date = new Date(start_date.getTime())
      while(iterator_date <= end_date){
        dates.push(this.formatDate(iterator_date))
        iterator_date.setDate(iterator_date.getDate() + 1);
      }

      let shift_index = 0;
      return dates.map(date => {
        if (shifts[shift_index].date === date) {
          shift_index++
          return {
            id: date,
            start: this.parseDate(date),
            title: shifts[shift_index - 1].shift.description,
            allDay: true,
            display: 'background'
          }
        }

        return {
          id: date,
          start: this.parseDate(date),
          title: 'Folga',
          allDay: true,
          display: 'background'
        }
      })
    }
  }

}
</script>