<template>
  <DashboardLayout title="Pedir Troca">
    <div class="my-2">
      <VueDatePicker
          v-model="date"
          format="dd-MM-yyyy"
          auto-apply
          locale="pt-PT"
          :min-date="minDate"
          ref="datePickerInput"
          @update:model-value="handleDateChange"
          :close-on-auto-apply="true"
          :enable-time-picker="false"
      />
    </div>
    <div v-if="date && !error">
      <span v-if="userShift"><u>Turno a realizar na data: <strong>{{ userShift.shift.description }}</strong></u></span>
      <span v-else><u>Turno a realizar na data: <strong>Folga</strong></u></span>
      <hr>
      <div v-if="availableSwaps && availableSwaps.length && userShift">
        <h1 class="is-size-4">Possíveis Trocas</h1>
      </div>
      <div v-else>
        <h1 class="is-size-4">Não há trocas possíveis para esta data</h1>
      </div>
      <div v-if="availableSwaps && availableSwaps.length">
        <swap-table  :users="users" :swaps="availableSwaps" @checkSwap="checkSwap" @uncheckSwap="uncheckSwap"/>
        <button class="button is-success" @click="submit">Submeter Pedidos</button>
      </div>
    </div>
    <div v-if="error">
      <strong><u>Erro a processar pedido</u></strong>
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
  components: { SwapTable, DashboardLayout, VueDatePicker },
  data(){
    return {
      date: null,
      userShift: null,
      availableSwaps: [],
      users: null,
      proposedSwaps: [],
      minDate: null,
      error: false
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

    let today = new Date();
    this.minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  },
  methods: {
    checkSwap(swap){
      this.proposedSwaps.push(swap)
    },
    uncheckSwap(swap){
      this.proposedSwaps = this.proposedSwaps.filter(s => !this.equalObjects(s, swap))
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
      if(!this.proposedSwaps.length){
        this.$toast.error('Tem de selecionar pelo menos 1 turno para pedir troca');
        return;
      }

      axios.post('/swaps', {
        user_shift: this.userShift,
        swaps: this.proposedSwaps
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
        this.error = false
        axios.get('/user-shifts', {
          params: {
            date: this.formattedDate
          }
        })
            .then(response => {
              if(response.data){
                this.userShift = response.data.user_shift
                this.availableSwaps = response.data.available_swaps
                this.users = response.data.user_ids
              }
            })
            .catch(error => {
              this.error = true
              this.$toast.error(error.response.data.message)
            })
      }
    }
  }
}
</script>
