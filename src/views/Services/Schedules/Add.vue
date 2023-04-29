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
      <table class="table is-fullwidth">
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
          <tr v-for="(user, user_index) in service.users">
            <td class="is-fullwidth">{{ user.name }} ({{ user.total_hours }} horas)</td>
            <td v-for="date_index in dates_in_range.length" :class="{'is-warning': dates_in_range[date_index - 1].day_of_week === 0 ||  dates_in_range[date_index - 1].day_of_week === 6}">
              <div class="select">
                <select
                    v-model="dates_in_range[date_index - 1].nurses[user_index].shift"
                    @change="updateUserTotalHoursAndNursesInDay(dates_in_range[date_index - 1].nurses[user_index].id, date_index - 1)">
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

export default {
  name: 'service-add-shifts',
  components: { DashboardLayout, VueDatePicker },
  data(){
    return {
      date_range: null,
      days_of_the_week: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      dates_in_range_past: [],
      shifts_to_users: [],
      already_submited: false,
      total_shift_nurses: 0,
      interval: null,
      service: {
        users: [],
        shifts: []
      }
    }
  },
  methods: {
    beforeRouteLeave(to, from, next) {
      clearInterval(this.interval)
      next()
    },
    updateUserTotalHoursAndNursesInDay(userId, dateIndex){
      const user = this.service.users.find(user => user.id === userId);

      user.total_hours = this.getTotalNurseHoursForUser(user);

      this.resetPossibleShiftsForDay(dateIndex);

      this.dates_in_range[dateIndex].nurses_total = this.updatePossibleShiftsForDay(dateIndex);
    },
    resetPossibleShiftsForDay(dateIndex){
      this.dates_in_range[dateIndex].possible_shifts = this.dates_in_range[dateIndex].possible_shifts.map(shift => ({
        ...shift,
        filled: 0
      }));
    },
    getTotalNurseHoursForUser(user){
      let totalHours = 0;

      this.dates_in_range.forEach(date => {
        const nurse = date.nurses.find(nurse => nurse.id === user.id && nurse.shift);
        if (nurse) {
          const shift = date.possible_shifts.find(shift => shift.id === nurse.shift);
          totalHours += shift.minutes / 60;
        }
      });

      return totalHours;
    },
    updatePossibleShiftsForDay(dateIndex){
      let nursesTotal = 0;

      this.dates_in_range[dateIndex].nurses.forEach(nurse => {
        if (nurse.shift) {
          nursesTotal++;
          const shift = this.dates_in_range[dateIndex].possible_shifts.find(shift => shift.id === nurse.shift);
          shift.filled++;
        }
      });

      return nursesTotal;
    },
    submitSchedule(draft, auto){
        // Insert new schedule
        axios.post(`/services/${this.$route.params.id}/schedules`, {
          data: this.dates_in_range,
          draft: draft ,
          date_range: this.date_range
        })
          .then(response => {
            this.$toast.success(response.data.message)
            if(!auto)
              this.$router.push({ name: 'service.schedules', params: { id: this.$route.params.id } })
            else
              this.$router.push({ name: 'service.schedules.edit', params: { id: this.$route.params.id, schedule: response.data.data.id} })
          })
          .catch(error => {
            if(!auto)
              this.$toast.error(error.response.data.message)
          })
          .finally(() => {
            clearInterval(this.interval)
          })
    }
  },
  computed:{
    total_nurses_required(){
      if(this.service.shifts)
        return this.service.shifts.reduce((acc, s) => {
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
      const options = { timeZone: 'Europe/Lisbon' };
      const startDate = new Date(start.toLocaleString('en-US', options));
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate = new Date(end.toLocaleString('en-US', options));
      endDate.setUTCHours(0, 0, 0, 0);
      const range = [];

      for (let timestamp = startDate.valueOf(); timestamp <= endDate.valueOf(); timestamp += 86400000) {
        const date = new Date(timestamp);
        const dateFormatted = date.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });

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
          possible_shifts: this.service.shifts.map(s => ({ ...s, filled: 0, show: true })),
          nurses: this.service.users.map(u => ({ id: u.id, shift: null })),
        });
      }

      this.dates_in_range_past = range;

      return range;
    }
  },
  mounted(){
    const id = this.$route.params.id

    axios.get(`/services/${id}`)
        .then(response => {
          this.service = response.data.data
          this.service.users = this.service.users.map(u => {
            return {
              ...u,
              total_hours: 0
            }
          })
        })
        .catch(error => console.log(error))

      this.interval = setInterval(() => {
        if(this.date_range && !this.already_submited){
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
