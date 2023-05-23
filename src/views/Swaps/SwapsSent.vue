<template>
  <DashboardLayout title="Pedidos de Troca Enviados">
    <div v-if="sentSwaps && sentSwaps.length" class="list has-hoverable-list-items has-overflow-ellipsis">
      <div class="list-item" v-for="swap in sentSwaps">
        <div class="list-item-content">
          <div class="list-item-title is-flex is-justify-content-space-between">
            <span>{{ swap.target_user.name }}</span>
          </div>
          <div class="list-item-description" v-if="swap.direct">
            <u><strong>{{ swap.target_shift_user.date }}</strong></u>
            <br>
            {{ swap.target_shift_user.shift.description }} {{ '&#8594;' }} {{ swap.payment_shift_user.shift.description }}
            <br>
            <strong :class="{
              'has-text-info': swap.status === 'Pendente',
              'has-text-danger': swap.status === 'Rejeitado',
              'has-text-success': swap.status === 'Aprovado'
            }">{{ swap.status }}</strong>
          </div>
          <div class="list-item-description" v-else>
            <u><strong>{{ swap.target_shift_user.date }}</strong></u>
            <br>
            {{ swap.target_shift_user.shift.description }} {{ '&#8594;' }} Folga
            <br>
            <u><strong>{{ swap.payment_shift_user.date }}</strong></u>
            <br>
            Folga {{ '&#8594;' }} {{ swap.payment_shift_user.shift.description }}
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
    <h1 v-else class="is-size-5">Não existem pedidos de trocas ativos</h1>
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
