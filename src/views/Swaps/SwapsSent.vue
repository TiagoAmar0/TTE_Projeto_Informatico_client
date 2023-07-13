<template>
  <DashboardLayout title="Pedidos de Troca Enviados">
    <u><strong>Filtar por estado:</strong></u>
    <div class="control">
      <label class="radio" v-for="option in status" :key="status.value">
        <input type="radio" :value="option.value" v-model="filterStatus">
        {{ option.label }}
      </label>
    </div>


    <hr>
    <div v-if="sentSwaps && sentSwaps.length" class="list has-hoverable-list-items has-overflow-ellipsis">
      <div class="list-item" v-for="swap in sentSwaps">
        <div class="list-item-content">
          <div class="list-item-title">
            <span>Para: {{ swap.target_user.name }}</span>
          </div>
          <div class="list-item-description list-item-description is-flex is-flex-direction-column" v-if="swap.direct">
            <u>{{ swap.target_shift_user.day_name }}. {{ swap.target_shift_user.day }} {{ swap.target_shift_user.month }}</u>

            <span>
            - Fazer <u><strong>{{ swap.payment_shift_user.shift.description }}</strong></u> em vez de <u><strong>{{ swap.target_shift_user.shift.description }}</strong></u>
            </span>

            <strong :class="{
              'has-text-info': swap.status === 'Pendente',
              'has-text-danger': swap.status === 'Rejeitado',
              'has-text-success': swap.status === 'Aprovado'
            }">{{ swap.status }}</strong>
          </div>
          <div class="list-item-description list-item-description is-flex is-flex-direction-column" v-else>
            <u>{{ swap.target_shift_user.day_name }}. {{ swap.target_shift_user.day }} {{ swap.target_shift_user.month }}</u>

            <span>
            - <u><strong>Folga</strong></u> em vez de <u><strong>{{ swap.target_shift_user.shift.description }}</strong></u>
            </span>

            <u>{{ swap.payment_shift_user.day_name }}. {{ swap.payment_shift_user.day }} {{ swap.payment_shift_user.month }}</u>
            <span>
              - Fazer <u><strong>{{ swap.payment_shift_user.shift.description }}</strong></u> em vez de <u><strong>Folga</strong></u>
            </span>

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
  data(){
    return {
      filterStatus: 'all',
      status: [
        {value: 'all', label: 'Todos'},
        {value: 'Rejeitado', label: 'Rejeitados'},
        {value: 'Pendente', label: 'Pendentes'},
        {value: 'Aprovado', label: 'Aprovados'},
      ]
    }
  },
  computed: {
    sentSwaps(){
      return this.$store.getters.swapsProposedByUser.filter(swap => {
        if(this.filterStatus === 'all')
          return true
        else
          return swap.status == this.filterStatus
      })
    }
  },
}
</script>
