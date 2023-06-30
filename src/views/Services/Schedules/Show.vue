<template>
  <DashboardLayout :title="'Horário de ' + schedule.start + ' até ' + schedule.end">
    <button class="button is-primary is-light mx-1 my-3" @click="$router.push({ name: 'service.schedules', params: { id: $route.params.id }})">
      Voltar
    </button>
    <button class=" my-3 button is-info mx-1" @click="$router.push({ name: 'service.schedules.edit', params: { id: schedule.service_id, schedule: schedule.id }})">
      Editar Horário
    </button>
    <button class=" my-3 button is-secondary mx-1" @click="exportSchedule">
      Exportar
    </button>
    <div v-if="dateRange" class="table-container">
      <table class="table is-fullwidth is-bordered">
        <thead>
        <tr>
          <td></td>
          <td v-for="(date, i) in datesInRange" class="is-narrow" :class="{'is-warning': date.day_of_week === 0 || date.day_of_week === 6}">
            <div v-for="shift in date.shifts">
              {{ shift.name }}: {{ shift.filled }}
              <br>
            </div>
            <u><strong>
              <span v-if="i === 0 || datesInRange[i-1].month !== datesInRange[i].month">
                {{ date.month.charAt(0).toUpperCase() + date.month.slice(1).replace('.', '')}}
              </span><br>
            {{ date.day }}
            <br>
              {{ daysOfWeek[date.day_of_week]}}</strong></u>
          </td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(user, user_index) in schedule.users">
          <td class="is-narrow">{{ user.name }} ({{ user.total_hours }} horas<span v-if="user.spare_minutes > 0"> {{ user.spare_minutes }} minutos</span>)</td>
          <td v-for="date_index in datesInRange.length" :class="{'is-warning': datesInRange[date_index - 1].day_of_week === 0 || datesInRange[date_index - 1].day_of_week === 6}">
            {{ datesInRange[date_index - 1].nurses[user_index].shift ? datesInRange[date_index - 1].nurses[user_index].shift : '-'}}
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
      daysOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      dateRange: null
    }
  },
  methods: {
    exportSchedule() {
      const serviceID = this.$route.params.id
      const scheduleID = this.$route.params.schedule

      try {
        axios.get(`/services/${serviceID}/schedules/${scheduleID}/export` , {
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
    datesInRange() {
      if (!this.dateRange) {
        return [];
      }

      const [start, end] = this.dateRange;
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

            let scheduleRecord = this.schedule.user_shifts.find((us) => {
              return us.date === dateFormatted && user.id === us.user_id;
            });

            if (scheduleRecord) {
              user.shift = scheduleRecord.shift.name;
            }

            return user;
          }),
        });
      }

      return this.getShiftsTotals(range);
    }
  },
  mounted(){
    const serviceID = this.$route.params.id
    const scheduleID = this.$route.params.schedule

    axios.get(`/services/${serviceID}/schedules/${scheduleID}`)
        .then(response => {
          this.schedule = response.data.data
          this.schedule.users = this.schedule.users.map(u => {
            let totalMinutes = this.schedule.user_shifts.reduce((acc, us) => {
              if(us.user_id !== u.id)
                return acc

              return acc + us.shift.minutes
            }, 0)

            return {
              ...u,
              total_hours: Math.floor(totalMinutes / 60),
              spare_minutes: Math.floor(totalMinutes % 60)
            }
          })
          let startDateFormatted = this.schedule.start.replace('/', '-')
          let endDateFormatted = this.schedule.end.replace('/', '-')
          this.dateRange = [new Date(startDateFormatted), new Date(endDateFormatted)]
        })
        .catch(error => console.log(error))
  }
}
</script>
