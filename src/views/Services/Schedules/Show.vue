<template>
  <DashboardLayout :title="'Horário de ' + schedule.start + ' até ' + schedule.end">
    <button class=" my-3 button is-info mx-1" @click="$router.push({ name: 'service.schedules.edit', params: { id: schedule.service_id, schedule: schedule.id }})">
      Editar Horário
    </button>
    <button class=" my-3 button is-secondary mx-1" @click="exportSchedule">
      Exportar
    </button>
    <div v-if="date_range" class="table-container">
      <table class="table is-fullwidth is-bordered">
        <thead>
        <tr>
          <td></td>
          <td v-for="(date, i) in dates_in_range" class="is-narrow" :class="{'is-warning': date.day_of_week === 0 || date.day_of_week === 6}">
            <div v-for="shift in date.shifts">
              {{ shift.name }}: {{ shift.filled }}
              <br>
            </div>
            <u><strong>
              <span v-if="i === 0 || dates_in_range[i-1].month !== dates_in_range[i].month">
                {{ date.month.charAt(0).toUpperCase() + date.month.slice(1).replace('.', '')}}
              </span><br>
            {{ date.day }}
            <br>
              {{ days_of_the_week[date.day_of_week]}}</strong></u>
          </td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(user, user_index) in schedule.users">
          <td class="is-narrow">{{ user.name }} ({{ user.total_hours }} horas)</td>
          <td v-for="date_index in dates_in_range.length" :class="{'is-warning': dates_in_range[date_index - 1].day_of_week === 0 || dates_in_range[date_index - 1].day_of_week === 6}">
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
      days_of_the_week: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      date_range: null
    }
  },
  methods: {
    exportSchedule() {
      const service_id = this.$route.params.id
      const schedule_id = this.$route.params.schedule

      try {
        axios.get(`/services/${service_id}/schedules/${schedule_id}/export` , {
          responseType: 'blob',
        })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `Horario_${this.schedule.start}_a_${this.schedule.end}.pdf`);
          document.body.appendChild(link);
          link.click();
          window.URL.revokeObjectURL(url);

        })
      } catch (error) {
        console.error(error);
      }
    },
    getShiftsTotals(range){
      return range.map(day => {
        return {
          ...day,
          shifts: this.schedule.shifts.map(shift => {
            return {
              ...shift,
              filled: this.schedule.user_shifts.reduce((acc, us) => {
                if (us.shift_id === shift.id && us.date === day.date)
                  return acc + 1

                return acc
              }, 0)
            }
          })
        }
      })
    },
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
          month: date.toLocaleDateString('pt-PT', { month: "short" }),
          day: date.toLocaleDateString('pt-PT', { day: "numeric" }),
          day_of_week: date.getDay(),
          nurses_total: 0,
          nurses: this.schedule.users.map((u) => {
            let user = {
              id: u.id,
              shift: null,
            };

            let schedule_record = this.schedule.user_shifts.find((us) => {
              return us.date === dateFormatted && user.id === us.user_id;
            });

            if (schedule_record) {
              user.shift = schedule_record.shift.name;
            }

            return user;
          }),
        });
      }

      return this.getShiftsTotals(range);
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

                return acc + (us.shift.minutes/60)
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
