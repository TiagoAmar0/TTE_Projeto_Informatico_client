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
          <tr v-for="swap in swaps" :key="swap.id">
            <td>
              {{ swap.proposing_user.name }}
            </td>
            <td>
              {{
                swap.direct
                ? `Fazer turno ${swap.payment_shift_user.shift.description} em vez de ${swap.target_shift_user.shift.description} de ${swap.payment_shift_user.date}`
                : `Fazer turno ${swap.payment_shift_user.shift.description} de em vez de Folga a ${swap.target_shift_user.date}`
              }}
            </td>
            <td>
              {{
                swap.direct
                    ? '-'
                    : `Folgar dia ${swap.payment_shift_user.date} em vez de fazer o turno ${swap.payment_shift_user.shift.description}`
              }}
            </td>
            <td class="is-narrow">
              <button class="button is-success mx-1" @click="approve(swap.id)">
                <i class="fas fa-check"></i>
              </button>
              <button class="button is-danger" @click="reject(swap.id)">
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

import axios from "axios";

export default {
  name: 'swaps-proposed-to-user-table',
  computed: {
    swaps(){
      return this.$store.getters.swapsProposedToUser
    }
  },
  methods: {
    approve(swap_id){
      axios.patch(`/swaps/${swap_id}/approve`)
          .then(response => {
            this.$toast.success(response.data.message)

            // Atualizar trocas
          })
          .catch(error => {
            this.$toast.error(error.response.data.message)
          })
    },
    reject(swap_id){
      axios.patch(`/swaps/${swap_id}/reject`)
          .then(response => {
            this.$toast.success(response.data.message)

            // Atualizar trocas
          })
          .catch(error => {
            this.$toast.error(error.response.data.message)
          })
    }
  }
}
</script>
