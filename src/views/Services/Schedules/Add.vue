<template>
  <DashboardLayout title="Adicionar turnos">
    <div>
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
            <td v-for="date in dates_in_range">
              <div class="icon-text" v-if="date.nurses_total < total_nurses_required">
                <span class="icon has-text-warning has-tooltip-arrow has-tooltip-multiline has-tooltip-bottom" data-tooltip="Poucos enfermeiros associados">
                  <i class="fas fa-exclamation-triangle"></i>
                </span>
              </div>
              <div v-for="shift in date.possible_shifts">
                <div class="icon-text" v-if="shift.filled < shift.nurses_qty">
                <span
                    class="icon has-text-warning has-tooltip-arrow has-tooltip-multiline has-tooltip-bottom"
                    :data-tooltip='"O turno " + shift.name + " tem poucos enfermeiros associados" '>
                  <i class="fas fa-exclamation-triangle"></i>
                </span>
                </div>
              </div>


              ({{ date.nurses_total }}/{{ total_nurses_required }})
              <br>
              {{ date.date }}

            </td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, user_index) in service.users">
            <td class="is-fullwidth">{{ user.name }} ({{ user.total_hours }} horas)</td>
            <td v-for="date_index in dates_in_range.length">
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
    </div>
  </DashboardLayout>
</template>


<script>
import DashboardLayout from "@/layouts/DashboardLayout.vue"
import axios from "axios";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { reactive } from '@vue/reactivity'
import { watchEffect } from "vue";

export default {
  name: 'service-add-shifts',
  components: { DashboardLayout, VueDatePicker },
  data(){
    return {
      date_range: null,
      dates_in_range_past: [],
      shifts_to_users: [],
      total_shift_nurses: 0,
      already_saved: false,
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
    handleShiftValueChange(user_id, date_index){
      let user = this.service.users.find(u => u.id === user_id)
      user.total_hours = 0;

      let total_nurse_hours = 0;
      // Update nurse hours
      for(let i = 0; i < this.dates_in_range.length; i++){
        for(let j = 0; j < this.dates_in_range[i].nurses.length; j++){
          if(this.dates_in_range[i].nurses[j].id === user.id && this.dates_in_range[i].nurses[j].shift){
            let shift = this.dates_in_range[i].possible_shifts.find(s => s.id === this.dates_in_range[i].nurses[j].shift)
            total_nurse_hours += shift.minutes / 60
          }
        }
      }

      user.total_hours = total_nurse_hours

      // Reset nurses set in given day
      let nurses_total = 0;
      this.dates_in_range[date_index].possible_shifts = this.dates_in_range[date_index].possible_shifts.map(s => {
        return {
          ...s,
          filled: 0
        }
      })

      for(let i = 0; i < this.dates_in_range[date_index].nurses.length; i++){
        if(this.dates_in_range[date_index].nurses[i].shift){
          nurses_total++
          let shift = this.dates_in_range[date_index].possible_shifts.find(s => s.id === this.dates_in_range[date_index].nurses[i].shift)
          shift.filled++
        }
      }
      this.dates_in_range[date_index].nurses_total = nurses_total;
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
            this.already_saved = true
            if(!auto)
              this.$router.push({ name: 'service.schedules', params: { id: this.$route.params.id } })
            else
              this.$router.push({ name: 'service.schedules.edit', params: { id: this.$route.params.id, schedule: response.data.data.id} })
          })
          .catch(error => {
            if(!auto)
              this.$toast.error(error.response.data.message)
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
    dates_in_range(){
      if(this.date_range){
        let start = new Date(
            this.date_range[0].getFullYear(),
            this.date_range[0].getMonth(),
            this.date_range[0].getDate(),
            this.date_range[0].getHours(),
            this.date_range[0].getMinutes(),
            this.date_range[0].getSeconds()
        )
        let end = new Date(
            this.date_range[1].getFullYear(),
            this.date_range[1].getMonth(),
            this.date_range[1].getDate(),
            this.date_range[1].getHours(),
            this.date_range[1].getMinutes(),
            this.date_range[1].getSeconds()
        )

        let range = []
        let dates_inserted = []
        while (start <=  end) {

          let new_date = start.toLocaleDateString('pt-PT', {day: '2-digit', month: '2-digit'})
          let new_date_formatted = start.toLocaleDateString('pt-PT', {day: '2-digit', month: '2-digit', year: 'numeric'})

          // Check if date is already in range
          let index = null;
          for(let i = 0; i < this.dates_in_range_past.length; i++) {
            if (this.dates_in_range_past[i].date === new_date) {
              index = i;
              break;
            }
          }

          // If date is not in range, insert new object
          if(!index){
            range.push({
              date: new_date,
              date_formatted: new_date_formatted,
              nurses_total: 0,
              possible_shifts: this.service.shifts.map(s => {
                return { ...s, filled: 0, show: true}
              }),
              nurses: this.service.users.map(u => {
                return {
                  id: u.id,
                  shift: null
                }
              })
            });
          } else {
            // else push old object
            range.push(this.dates_in_range_past[index])
          }

          dates_inserted.push(new_date)

          start.setDate(start.getDate() + 1);
        }

        // Clean dates that are outside of range
        range = range.filter(d => {
          return dates_inserted.find(i_d => i_d === d.date)
        })

        this.dates_in_range_past = range
        return range
      }
      this.dates_in_range_past = []
      return [];
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
        if(this.date_range && !this.already_saved){
          this.submitSchedule(true, true)
        }
      }, 30000)
  },
  watch:{
  }
}
</script>
