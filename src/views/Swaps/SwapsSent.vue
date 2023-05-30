<template>
  <DashboardLayout title="Pedidos de Troca Enviados">
    <div v-if="sentSwaps && sentSwaps.length" class="list has-hoverable-list-items has-overflow-ellipsis">
      <div class="list-item" v-for="swap in sentSwaps">
        <div class="list-item-content">
          <div class="list-item-title is-flex is-justify-content-space-between">
            <span>Para: {{ swap.target_user.name }}</span>
          </div>
          <div class="list-item-description" v-if="swap.direct">
            <u>{{ swap.target_shift_user.day_name }}. {{ swap.target_shift_user.day }} {{ swap.target_shift_user.month }}</u>
            <br>
            - Fazer <u><strong>{{ swap.target_shift_user.shift.description }}</strong></u> em vez de <u><strong>{{ swap.payment_shift_user.shift.description }}</strong></u>
            <br>
            <strong :class="{
              'has-text-info': swap.status === 'Pendente',
              'has-text-danger': swap.status === 'Rejeitado',
              'has-text-success': swap.status === 'Aprovado'
            }">{{ swap.status }}</strong>
          </div>
          <div class="list-item-description" v-else>
            <u>{{ swap.target_shift_user.day_name }}. {{ swap.target_shift_user.day }} {{ swap.target_shift_user.month }}</u>
            <br>
            - <u><strong>Folga</strong></u> em vez de <u><strong>{{ swap.target_shift_user.shift.description }}</strong></u>
            <br>
            <u>{{ swap.payment_shift_user.day_name }}. {{ swap.payment_shift_user.day }} {{ swap.payment_shift_user.month }}</u>
            <br>
            - Fazer <u><strong>{{ swap.payment_shift_user.shift.description }}</strong></u> em vez de <u><strong>Folga</strong></u>
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
