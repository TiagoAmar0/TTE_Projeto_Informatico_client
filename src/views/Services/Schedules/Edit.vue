<template>
  <DashboardLayout title="Alterar Horário">
    <button class="button is-primary is-light mx-1 my-3" @click="$router.push({ name: 'service.schedules', params: { id: $route.params.id }})">
      Voltar
    </button>
    <div class="my-2">
      <VueDatePicker
          v-model="dateRange"
          range
          format="dd-MM-yyyy"
          auto-apply
          :close-on-auto-apply="true"
          :enable-time-picker="false"
      />
    </div>

    <div v-if="dateRange" class="table-container">
      <table class="table is-fullwidth is-bordered is-striped">
        <thead>
        <tr>
          <td></td>
          <td v-for="(date, i) in datesInRange" :class="{'is-warning': date.day_of_week === 0 || date.day_of_week === 6}">
            <div v-for="shift in date.possible_shifts">
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
          <td v-for="date_index in datesInRange.length" :class="{'is-warning': datesInRange[date_index - 1].day_of_week === 0 ||  datesInRange[date_index - 1].day_of_week === 6}">
            <div class="select">
              <select
                  v-model="datesInRange[date_index - 1].nurses[user_index].shift"
                  @change="handleShiftValueChange(datesInRange[date_index - 1].nurses[user_index].id, date_index - 1)">
                <option :value="null">-</option>
                <option v-for="shift in datesInRange[date_index - 1].possible_shifts.filter(s => s.show === true)" :value="shift.id">
                  {{ shift.name }}
                </option>
              </select>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      <button class="button is-success mx-1" @click="submitSchedule(false)">
        Submeter
      </button>
      <button class="button is-secondary mx-1" @click="submitSchedule(true)">
        Guardar Rascunho
      </button>
    </div>
  </DashboardLayout>
</template>


<script>
import DashboardLayout from "@/layouts/DashboardLayout.vue"
import axios from "axios";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { reactive } from '@vue/reactivity'

export default {
  name: 'service-edit-shifts',
  components: { DashboardLayout, VueDatePicker },
  data(){
    return {
      dateRange: null,
      schedule: null,
      interval: null,
      datesInRangeTemp: [],
      daysOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      service: {
        users: [],
        shifts: []
      }
    }
  },
  methods: {
    handleShiftValueChange(userId, dateIndex){
      let user = this.schedule.users.find(u => u.id === userId)

      user.total_hours = this.updateNurseHours(userId);

      this.resetPossibleShiftsForDay(dateIndex)

      this.datesInRange[dateIndex].nursesTotal = this.updatePossibleShiftsForDay(dateIndex)
    },
    updateNurseHours(userId){
      let totalNurseHours = 0;

      for (const date of this.datesInRange) {
        const nurse = date.nurses.find((n) => n.id === userId && n.shift);
        if (nurse) {
          const shift = date.possible_shifts.find((s) => s.id === nurse.shift);
          totalNurseHours += shift.minutes / 60;
        }
      }

      return totalNurseHours;
    },
    resetPossibleShiftsForDay(dateIndex){
      this.datesInRange[dateIndex].possible_shifts = this.datesInRange[dateIndex].possible_shifts.map(shift => ({
        ...shift,
        filled: 0
      }));
    },
    updatePossibleShiftsForDay(dateIndex){
      let nursesTotal = 0;

      for (const nurse of this.datesInRange[dateIndex].nurses) {
        if (nurse.shift) {
          nursesTotal++;
          const shift = this.datesInRange[dateIndex].possible_shifts.find((s) => s.id === nurse.shift);
          shift.filled++;
        }
      }

      return nursesTotal;
    },
    submitSchedule(draft, auto){
        axios.put(`/services/${this.$route.params.id}/schedules/${this.$route.params.schedule}`, {
          data: this.datesInRange,
          draft: draft ,
          date_range: this.dateRange
        })
          .then(response => {
            this.$toast.success(response.data.message)

            if(!auto)
              this.$router.push({ name: 'service.schedules', params: { id: this.$route.params.id } })
          })
          .catch(error => {
            if(!auto)
              this.$toast.error(error.response.data.message)
          })
    }
  },
  computed:{
    totalNursesRequired(){
      if(this.schedule.shifts)
        return this.schedule.shifts.reduce((acc, s) => {
          return acc + s.nurses_qty
        }, 0)

      return 0
    },
    datesInRange() {
      if (!this.dateRange) {
        this.datesInRangeTemp = [];
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

        const existingDateIndex = this.datesInRangeTemp.findIndex(d => d.date === dateFormatted);
        if (existingDateIndex !== -1) {
          range.push(this.datesInRangeTemp[existingDateIndex]);
          continue;
        }

        range.push({
          date: dateFormatted,
          date_formatted: date.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' }),
          day_of_week: date.getDay(),
          month: date.toLocaleDateString('pt-PT', { month: "short" }),
          day: date.toLocaleDateString('pt-PT', { day: "numeric" }),
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

            let scheduleRecord = this.schedule.user_shifts.find((us) => {
              return us.date === dateFormatted && user.id === us.user_id;
            });

            if (scheduleRecord) {
              user.shift = scheduleRecord.shift_id;
            }

            return user;
          }),
        });
      }

      this.datesInRangeTemp = range;
      return range;
    }
  },
  mounted(){
    const serviceID = this.$route.params.id
    const scheduleID = this.$route.params.schedule

    // Get schedule
    axios.get(`/services/${serviceID}/schedules/${scheduleID}`)
        .then(response => {
          this.schedule = response.data.data
          this.schedule.users = this.schedule.users.map(u => {

            let totalMinutes = this.schedule.user_shifts.reduce((acc, us) => {
              if(us.user_id !== u.id)
                return acc
                let shift = this.schedule.shifts.find(s => s.id === us.shift_id)

              return acc + shift.minutes
            }, 0)


            return {
              ...u,
              total_hours: Math.floor(totalMinutes / 60),
              spare_minutes: Math.floor(totalMinutes % 60),
            }
          })

          let startDateFormatted = this.schedule.start.replace('/', '-')
          let endDateFormatted = this.schedule.end.replace('/', '-')
          this.dateRange = [new Date(startDateFormatted), new Date(endDateFormatted)]
        })
        .catch(error => console.log(error))

    this.interval = setInterval(() => {
      if(this.dateRange){
        this.submitSchedule(true, true)
      }
    }, 30000)
  },
  beforeUnmount(){
    clearInterval(this.interval)
  }
}
</script>
