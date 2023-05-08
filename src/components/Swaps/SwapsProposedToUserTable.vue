<template>
  <div class="card">
    <div class="card-content">
      <h1 class="is-size-4">Trocas que me estão a propor</h1>
      <div class="table-container" v-if="swaps">
        <table class="table">
          <thead>
          <tr>
            <th>Enfermeiro</th>
            <th>Troca proposta</th>
            <th>Pagamento</th>
            <th>Ações</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="swap in swaps">
            <td>
              {{ swap.proposing_user.name }}
            </td>
            <td>
              {{
                swap.direct
                ? `Fazer turno ${swap.payment_shift_user.shift.name} em vez de ${swap.target_shift_user.shift.name} de ${swap.payment_shift_user.date}`
                : `Fazer turno ${swap.payment_shift_user.shift.name} de em vez de Folga a ${swap.target_shift_user.date}`
              }}
            </td>
            <td>
              {{
                swap.direct
                    ? '-'
                    : `Folgar dia ${swap.payment_shift_user.date} em vez de fazer o turno ${swap.payment_shift_user.shift.name}`
              }}
            </td>
            <td class="is-narrow">
              <button class="button is-success mx-1">
                <i class="fas fa-check"></i>
              </button>
              <button class="button is-danger">
                <i class="fas fa-cancel"></i>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <strong><u>Não há pedidos de troca</u></strong>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'swaps-proposed-to-user-table',
  computed: {
    swaps(){
      return this.$store.getters.swapsProposedToUser
    }
  }
}
</script>
