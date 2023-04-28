<template>
  <DashboardLayout title="Adicionar turnos">
    <div class="my-2">
      <VueDatePicker
          v-model="date_range"
          range
          format="dd-MM-yyyy"
          auto-apply
          :close-on-auto-apply="true"
          :enable-time-picker="false"
      />
    </div>

    <div v-if="date_range" class="table-container">
      <table class="table is-fullwidth is-bordered">
        <thead>
        <tr>
          <td></td>
          <td v-for="date in dates_in_range" :class="{'is-warning': date.day_of_week === 0 || date.day_of_week === 6}">
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
          <td v-for="date_index in dates_in_range.length" :class="{'is-warning': dates_in_range[date_index - 1].day_of_week === 0 ||  dates_in_range[date_index - 1].day_of_week === 6}">
            <div class="select">
              <select
                  v-model="dates_in_range[date_index - 1].nurses[user_index].shift"
                  @change="handleShiftValueChange(dates_in_range[date_index - 1].nurses[user_index].id, date_index - 1)">
                <option :value="null">-</option>
                <option v-for="shift in dates_in_range[date_index - 1].possible_shifts.filter(s => s.show === true)" :value="shift.id">
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
      date_range: null,
      schedule: null,
      interval: null,
      dates_in_range_past: [],
      days_of_the_week: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      shifts_to_users: [],
      total_shift_nurses: 0,
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

      this.dates_in_range[dateIndex].nurses_total = this.updatePossibleShiftsForDay(dateIndex)
    },
    updateNurseHours(userId){
      let total_nurse_hours = 0;

      // Update nurse hours
      for (const date of this.dates_in_range) {
        const nurse = date.nurses.find((n) => n.id === userId && n.shift);
        if (nurse) {
          const shift = date.possible_shifts.find((s) => s.id === nurse.shift);
          total_nurse_hours += shift.minutes / 60;
        }
      }

      return total_nurse_hours;
    },
    resetPossibleShiftsForDay(dateIndex){
      this.dates_in_range[dateIndex].possible_shifts = this.dates_in_range[dateIndex].possible_shifts.map(shift => ({
        ...shift,
        filled: 0
      }));
    },
    updatePossibleShiftsForDay(dateIndex){
      let nurses_total = 0;

      for (const nurse of this.dates_in_range[dateIndex].nurses) {
        if (nurse.shift) {
          nurses_total++;
          const shift = this.dates_in_range[dateIndex].possible_shifts.find((s) => s.id === nurse.shift);
          shift.filled++;
        }
      }

      return nurses_total;
    },
    submitSchedule(draft, auto){

        // Insert new schedule
        axios.put(`/services/${this.$route.params.id}/schedules/${this.$route.params.schedule}`, {
          data: this.dates_in_range,
          draft: draft ,
          date_range: this.date_range
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
    total_nurses_required(){
      if(this.schedule.shifts)
        return this.schedule.shifts.reduce((acc, s) => {
          return acc + s.nurses_qty
        }, 0)

      return 0
    },
    dates_in_range() {
      if (!this.date_range) {
        this.dates_in_range_past = [];
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

        const existingDateIndex = this.dates_in_range_past.findIndex(d => d.date === dateFormatted);
        if (existingDateIndex !== -1) {
          range.push(this.dates_in_range_past[existingDateIndex]);
          continue;
        }

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
              user.shift = schedule_record.shift_id;
            }

            return user;
          }),
        });
      }

      this.dates_in_range_past = range;
      return range;
    }
  },
  mounted(){
    const service_id = this.$route.params.id
    const schedule_id = this.$route.params.schedule

    // Get schedule
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

    this.interval = setInterval(() => {
      if(this.date_range){
        this.submitSchedule(true, true)
      }
    }, 30000)
  },
  beforeUnmount(){
    clearInterval(this.interval)
  },
  watch:{
  }
}
</script>
