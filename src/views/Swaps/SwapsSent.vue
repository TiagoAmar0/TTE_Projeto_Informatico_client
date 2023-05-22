<template>
  <DashboardLayout title="Pedidos de Troca Enviados">

    <div v-if="sentSwaps" class='container'>
      <div class="list has-hoverable-list-items has-overflow-ellipsis">
        <div class="list-item" v-for="swap in sentSwaps">
          <div class="list-item-image">
            <figure class="image is-48x48">
              <img class="is-rounded" src="@/assets/img/user-avatar.png" alt="">
            </figure>
          </div>

          <div class="list-item-content">
            <div class="list-item-title is-flex is-justify-content-space-between">
              <span>{{ swap.target_user.name }}</span>
            </div>
            <div class="list-item-description" v-if="swap.direct">
              {{ swap.target_shift_user.date }} : {{ swap.target_shift_user.shift.description }} {{ '&#8594;' }} {{ swap.payment_shift_user.shift.description }}
              <br>
              <strong :class="{
                'has-text-info': swap.status === 'Pendente',
                'has-text-danger': swap.status === 'Rejeitado',
                'has-text-success': swap.status === 'Aprovado'
              }">{{ swap.status }}</strong>
            </div>
            <div class="list-item-description" v-else>
              {{ swap.target_shift_user.date }} : {{ swap.target_shift_user.shift.description }} {{ '&#8594;' }} Folga
              <br>
              {{ swap.payment_shift_user.date }} : Folga {{ '&#8594;' }} {{ swap.payment_shift_user.shift.description }}
              <br>
              <strong :class="{
                'has-text-info': swap.status === 'Pendente',
                'has-text-danger': swap.status === 'Rejeitado',
                'has-text-success': swap.status === 'Aprovado'
              }">{{ swap.status }}</strong>
            </div>
          </div>

        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script>
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import 'bulma-list/css/bulma-list.css'
export default {
  name: 'swaps-sent',
  components: { DashboardLayout },
  computed: {
    sentSwaps(){
      return this.$store.getters.swapsProposedByUser
    }
  },
}
</script>
