<template>
  <DashboardLayout title="Pedir Troca">
    <div class="my-2">
      <VueDatePicker
          v-model="date"
          format="dd-MM-yyyy"
          auto-apply
          ref="datePickerInput"
          @update:model-value="handleDateChange"
          :close-on-auto-apply="true"
          :enable-time-picker="false"
      />
    </div>
    <div v-if="date">
      <strong v-if="user_shift"><u>Turno a realizar na data: {{ user_shift.shift.name }}</u></strong>
      <strong v-else><u>Turno a realizar na data: Folga</u></strong>
      <hr>
      <div v-if="available_swaps && available_swaps.length && user_shift">
        <h1 class="is-size-4">Possíveis Trocas</h1>

      </div>
      <div v-else>
        <h1 class="is-size-4">Não há trocas possíveis para esta data</h1>
      </div>
      <div v-if="available_swaps && available_swaps.length">
        <swap-table  :users="users" :swaps="available_swaps" @checkSwap="checkSwap" @uncheckSwap="uncheckSwap"/>
        <button class="button is-success" @click="submit">Submeter Pedidos</button>
      </div>
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
      available_swaps: [],
      users: null,
      proposed_swaps: []
    }
  },
  computed: {
    formattedDate(){
      if(!this.date)
        return null

      const year = this.date.getFullYear();
      const month = this.date.getMonth();
      const day = this.date.getDate();
      const newDate = new Date(Date.UTC(year, month, day));
      newDate.setUTCHours(0, 0, 0, 0);

      return newDate.toLocaleDateString('pt-PT', {day: '2-digit', month: '2-digit', year: 'numeric'}).replaceAll('/', '-');
    }
  },
  mounted(){
    this.$refs.datePickerInput.openMenu()
  },
  methods: {
    checkSwap(swap){
      this.proposed_swaps.push(swap)
    },
    uncheckSwap(swap){
      this.proposed_swaps = this.proposed_swaps.filter(s => !this.equalObjects(s, swap))
    },
    equalObjects(obj1, obj2){
      for (let prop in obj1) {
        if (obj1[prop] !== obj2[prop]) {
          return false;
        }
      }

      return true
    },
    submit(){
      if(!this.proposed_swaps.length){
        this.$toast.error('Tem de selecionar pelo menos 1 turno para pedir troca');
        return;
      }

      axios.post('/swaps', {
        user_shift: this.user_shift,
        swaps: this.proposed_swaps
      })
          .then(response => {
            this.$toast.success(response.data.message)
            this.$store.dispatch('refresh')
                .then(() => {
                  this.$router.push({ name: 'dashboard' })
                })
          })
          .catch(error => {
            this.$toast.error(error.response.data.message)
          })
    },
    handleDateChange(){
      if(this.date){
        axios.get('/user-shifts', {
          params: {
            date: this.formattedDate
          }
        })
            .then(response => {
              if(response.data){
                this.user_shift = response.data.user_shift
                this.available_swaps = response.data.available_swaps
                this.users = response.data.user_ids
              }
            })
            .catch(error => console.log(error))
      }
    }
  }
}
</script>
