<template>
  <DashboardLayout title="Pedir Troca">
    <div class="my-2">
      <VueDatePicker
          v-model="date"
          format="dd-MM-yyyy"
          auto-apply
          @update:model-value="handleDateChange"
          :close-on-auto-apply="true"
          :enable-time-picker="false"
      />
    </div>
    <div v-if="user_shift">
      <div >
        <h1>Turno associado: {{ user_shift.shift.name }}</h1>
      </div>
      <hr>
      <h1 class="is-size-3">Possíveis Trocas</h1>
      <swap-table :users_with_dayoff="users_without_shift" :swaps="available_swaps"/>
    </div>
  </DashboardLayout>
</template>

<script>
import DashboardLayout from "@/layouts/DashboardLayout.vue"
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import axios from "axios";
import SwapTable from "@/components/Swaps/SwapTable.vue";


export default {
  name: 'propose-swap',
  components: {SwapTable, DashboardLayout, VueDatePicker },
  data(){
    return {
      date: null,
      user_shift: null,
      available_swaps: null,
      users_without_shift: null
    }
  },
  methods: {
    handleDateChange(){
      if(this.date){
        axios.get('/user-shifts', {
          params: {
            date: this.date
          }
        })
            .then(response => {
              this.user_shift = response.data.user_shift
              this.available_swaps = response.data.available_swaps
              this.users_without_shift = response.data.users_without_shift
            })
            .catch(error => console.log(error))
      }
    }
  }
}
</script>
