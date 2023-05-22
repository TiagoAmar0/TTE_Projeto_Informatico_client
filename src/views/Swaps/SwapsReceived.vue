<template>
  <DashboardLayout title="Pedidos de Troca Recebidos">

    <div v-if="swapsReceived" class='container'>
      <div class="list has-hoverable-list-items has-overflow-ellipsis">
        <div class="list-item" v-for="swap in swapsReceived">
          <div class="list-item-image">
            <figure class="image is-48x48">
              <img class="is-rounded" src="@/assets/img/user-avatar.png" alt="">
            </figure>
          </div>

          <div class="list-item-content">
            <div class="list-item-title is-flex is-justify-content-space-between">
              <span>{{ swap.proposing_user.name }}</span>
            </div>
            <div class="list-item-description" v-if="swap.direct">
              {{ swap.payment_shift_user.date }} : {{ swap.payment_shift_user.shift.description }} {{ '&#8594;' }} {{ swap.target_shift_user.shift.description }}
              <br>
              <div class="buttons are-small mt-1">
                <button :disabled="processing" class="button is-success" @click="approve(swap.id)">Aceitar</button>
                <button :disabled="processing" class="button is-danger" @click="reject(swap.id)">Rejeitar</button>
              </div>
            </div>
            <div class="list-item-description" v-else>
              {{ swap.target_shift_user.date }} : Folga {{ '&#8594;' }} {{ swap.target_shift_user.shift.description }}
              <br>
              {{ swap.payment_shift_user.date }} : {{ swap.payment_shift_user.shift.description }} {{ '&#8594;' }} Folga
              <br>
              <div class="buttons are-small mt-1">
                <button :disabled="processing" class="button is-success" @click="approve(swap.id)">Aceitar</button>
                <button :disabled="processing" class="button is-danger" @click="reject(swap.id)">Rejeitar</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script>
import axios from "axios";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import 'bulma-list/css/bulma-list.css'

export default {
  name: 'swaps-received',
  components: { DashboardLayout },
  computed: {
    swapsReceived(){
      return this.$store.getters.swapsProposedToUser
    },
  },
  data(){
    return {
      processing: false
    }
  },
  methods: {
    approve(swap_id){
      axios.patch(`/swaps/${swap_id}/approve`)
          .then(response => {
            this.$toast.success(response.data.message)
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
