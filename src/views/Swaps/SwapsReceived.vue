<template>
  <DashboardLayout title="Pedidos de Troca Recebidos">
    <div v-if="swapsReceived && swapsReceived.length"  class="list has-hoverable-list-items has-overflow-ellipsis">
      <div class="list-item" v-for="swap in swapsReceived">

        <div class="list-item-content">
          <div class="list-item-title is-flex is-justify-content-space-between">
            <span>De: {{ swap.proposing_user.name }}</span>
          </div>
          <div class="list-item-description" v-if="swap.direct">
            <u>{{ swap.payment_shift_user.day_name }}. {{ swap.payment_shift_user.day }} {{ swap.payment_shift_user.month }}</u>
            <br>
            - Fazer <u><strong>{{ swap.target_shift_user.shift.description }}</strong></u> em vez de <u><strong>{{ swap.payment_shift_user.shift.description }}</strong></u>
            <br>
            <div class="buttons are-small mt-1">
              <button :disabled="processing" class="button is-success" @click="approve(swap.id)">Aceitar</button>
              <button :disabled="processing" class="button is-danger" @click="reject(swap.id)">Rejeitar</button>
            </div>
          </div>
          <div class="list-item-description" v-else>
            <u>{{ swap.target_shift_user.day_name }}. {{ swap.target_shift_user.day }} {{ swap.target_shift_user.month }}</u>
            <br>
             - Fazer <u><strong>{{ swap.target_shift_user.shift.description }}</strong></u> em vez de <u><strong>Folga</strong></u>
            <br>
            <u>{{ swap.payment_shift_user.day_name }}. {{ swap.payment_shift_user.day }} {{ swap.payment_shift_user.month }}</u>
            <br>
            - <u><strong>Folga</strong></u> em vez de <u><strong>{{ swap.payment_shift_user.shift.description }}</strong></u>
            <br>
            <div class="buttons are-small mt-1">
              <button :disabled="processing" class="button is-success" @click="swapToConfirm = swap.id; action='approve'">Aceitar</button>
              <button :disabled="processing" class="button is-danger" @click="swapToConfirm = swap.id; action='reject'">Rejeitar</button>
            </div>
          </div>
        </div>

      </div>

      <confirm-swap-model
          v-if="swapToConfirm"
          @confirm-accept="approve(swapToConfirm)"
          @confirm-reject="reject(swapToConfirm)"
          @cancel="swapToConfirm = null; action = null"
          :action="action" />
    </div>
    <h1 v-else class="is-size-5">Não foram recebidos pedidos de troca</h1>
  </DashboardLayout>
</template>

<script>
import axios from "axios";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import 'bulma-list/css/bulma-list.css'
import ConfirmSwapModel from "@/components/Layout/Dashboard/ConfirmSwapModel.vue";

export default {
  name: 'swaps-received',
  components: {ConfirmSwapModel, DashboardLayout },
  computed: {
    swapsReceived(){
      return this.$store.getters.swapsProposedToUser
    },
  },
  data(){
    return {
      processing: false,
      swapToConfirm: null,
      action: null
    }
  },
  methods: {
    approve(swap_id){
      axios.patch(`/swaps/${swap_id}/approve`)
          .then(response => {
            this.$toast.success(response.data.message)
            this.swapToConfirm = null;
            this.action = null
            this.refresh()
          })
          .catch(error => {
            this.$toast.error(error.response.data.message)
          })
          .finally(() => {
            this.processing = false
          })
    },
    reject(swap_id){
      axios.patch(`/swaps/${swap_id}/reject`)
          .then(response => {
            this.$toast.success(response.data.message)
            this.refresh()
            this.swapToConfirm = null;
            this.action = null
          })
          .catch(error => {
            this.$toast.error(error.response.data.message)
          })
          .finally(() => {
            this.processing = false
          })
    },
    refresh(){
      this.processing = true
      this.$store.dispatch('refresh')
          .catch((error) => {
            console.log(error)
          })
          .finally(() => {
            this.processing = false
          })
    }
  }
}
</script>
