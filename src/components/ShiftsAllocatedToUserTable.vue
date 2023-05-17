<template>
  <div class="card">
    <div class="card-content">
      <h1 class="is-size-4">Próximos turnos</h1>
      <div class="table-container">
        <table class="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th>Data</th>
              <th>Turno</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="shift in userShifts" :key="shift.id">
              <td>{{ shift.date }}</td>
              <td>{{ shift.shift }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'shifts-allocated-to-user-table',
    data(){
      return {}
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
      userShifts(){
        if(!this.$store.state.user)
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
              date: date,
              shift: shifts[shift_index - 1].shift.description
            }
          }

          return {
            date: date,
            shift: 'Folga'
          }
        })
      }
    }
  }
</script>
