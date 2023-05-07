<template>
  <div>
    <h1 class="is-size-4">Trocas propostas por mim</h1>
    <div class="table-container" v-if="swaps">
      <table class="table">
        <thead>
          <tr>
            <th>O meu turno</th>
            <th>Turno pretendido</th>
            <th>Pessoa</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="swap in swaps">
            <td>
              {{ swap.target_shift_user.shift.name }} de {{ swap.target_shift_user.date }}
            </td>
            <td>
              {{ swap.payment_shift_user.shift.name }} de {{ swap.payment_shift_user.date }}
            </td>
            <td>
              {{ swap.target_user.name }}
            </td>
            <td>
              {{ swap.status }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <strong><u>Não há pedidos de troca</u></strong>
    </div>
  </div>
</template>

<script>
export default {
  name: 'swaps-proposed-by-user-table',
  computed: {
    swaps(){
      return this.$store.getters.swapsProposedByUser
    }
  }
}
</script>