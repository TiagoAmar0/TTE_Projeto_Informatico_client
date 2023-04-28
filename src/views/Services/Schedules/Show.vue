<template>
  <DashboardLayout :title="'Horário de ' + schedule.start + ' até ' + schedule.end">
    <button class=" my-3 button is-info mx-1" @click="$router.push({ name: 'service.schedules.edit', params: { id: schedule.service_id, schedule: schedule.id }})">
      Editar Horário
    </button>
    <div v-if="date_range" class="table-container">
      <table class="table is-fullwidth is-bordered">
        <thead>
        <tr>
          <td></td>
          <td v-for="date in dates_in_range">
            <div v-for="shift in date.possible_shifts">
              Turno {{ shift.name }}: {{ shift.filled }}
              <br>
            </div>
            <u><strong>{{ days_of_the_week[date.day_of_week]}}
            <br>
            {{ date.date }}</strong></u>
          </td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(user, user_index) in schedule.users">
          <td class="is-fullwidth">{{ user.name }} ({{ user.total_hours }} horas)</td>
          <td v-for="date_index in dates_in_range.length">
            {{ dates_in_range[date_index - 1].nurses[user_index].shift ? dates_in_range[date_index - 1].nurses[user_index].shift : '-'}}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </DashboardLayout>
</template>

<script>
import axios from "axios";
import DashboardLayout from "@/layouts/DashboardLayout.vue";

export default {
  name: 'schedules-show',
  components: { DashboardLayout },
  data(){
    return {
      schedule: [],
      days_of_the_week: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],

      date_range: null
    }
  },
  computed: {
    dates_in_range() {
      if (!this.date_range) {
        return [];
      }

      const [start, end] = this.date_range;
      const startYear = start.getFullYear();
      const startMonth = start.getMonth();
      const startDay = start.getDate();
      const startDate = new Date(Date.UTC(startYear, startMonth, startDay));
      startDate.setUTCHours(0, 0, 0, 0);
      const endYear = end.getFullYear();
      const endMonth = end.getMonth();
      const endDay = end.getDate();
      const endDate = new Date(Date.UTC(endYear, endMonth, endDay));
      endDate.setUTCHours(0, 0, 0, 0);
      const range = [];

      for (let timestamp = startDate.valueOf(); timestamp <= endDate.valueOf(); timestamp += 86400000) {
        const date = new Date(timestamp);
        const dateFormatted = date.toLocaleDateString('pt-PT', {day: '2-digit', month: '2-digit', year: 'numeric'});

        range.push({
          date: dateFormatted,
          date_formatted: date.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' }),
          day_of_week: date.getDay(),
          nurses_total: 0,
          possible_shifts: this.schedule.shifts.map((s) => {
            return {
              ...s,
              filled: this.schedule.user_shifts.reduce((acc, us) => {
                if (us.date !== dateFormatted)
                  return acc

                let shift = this.schedule.shifts.find(sh => sh.id === us.shift_id)
                if (shift.name === s.name)
                  return acc + 1

                return acc

              }, 0),
              show: true
            };
          }),
          nurses: this.schedule.users.map((u) => {
            let user = {
              id: u.id,
              shift: null,
            };

            let schedule_record = this.schedule.user_shifts.find((us) => {
              return us.date === dateFormatted && user.id === us.user_id;
            });

            if (schedule_record) {
              let shift = this.schedule.shifts.find(s => s.id = schedule_record.shift_id)
              user.shift = shift.name;
            }

            return user;
          }),
        });
      }

      return range;
    }
  },
  mounted(){
    const service_id = this.$route.params.id
    const schedule_id = this.$route.params.schedule

    axios.get(`/services/${service_id}/schedules/${schedule_id}`)
        .then(response => {
          this.schedule = response.data.data
          this.schedule.users = this.schedule.users.map(u => {
            return {
              ...u,
              total_hours: this.schedule.user_shifts.reduce((acc, us) => {
                if(us.user_id !== u.id)
                  return acc

                let shift = this.schedule.shifts.find(s => s.id === us.shift_id)
                return acc + (shift.minutes/60)
              }, 0),
            }
          })
          let start_date_formatted = this.schedule.start.replace('/', '-')
          let end_date_formatted = this.schedule.end.replace('/', '-')
          this.date_range = [new Date(start_date_formatted), new Date(end_date_formatted)]
        })
        .catch(error => console.log(error))
  }
}
</script>
