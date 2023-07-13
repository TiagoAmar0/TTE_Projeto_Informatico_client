<template>
  <div class="table-container">
    <table class="table is-fullwidth is-striped">
      <thead>
        <tr>
          <td>Nome</td>
          <td>Opções</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name }}</td>
          <td>
            <span v-for="(swap, index) in filteredSwaps(user.id)">
              <input type="checkbox" v-model="swap.checked" @input="handleCheckChange(swap)">
              {{ swap.rest
                ? `Folgar hoje e pagar a ${swap.day} de ${swap.month} (${swap.day_of_week}) no turno ${swap.shift_name}`
                : `Troca direta para o turno ${swap.shift_name} de hoje` }}
              <br v-if="index < filteredSwaps(user.id).length - 1">
              <br v-if="index < filteredSwaps(user.id).length - 1">
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'swap-table',
  props: ['swaps', 'users'],
  data(){
    return {
      availableSwaps: []
    }
  },
  methods: {
    handleCheckChange(swap){
      if(!swap.checked) {
        this.$emit('checkSwap', swap)
      } else {
        this.$emit('uncheckSwap', swap)
      }
    },
    filteredSwaps(userID){
      return this.swaps.filter(swap => swap.user_id === parseInt(userID)).map(swap => {
        return {
          ...swap,
          checked: false
        }
      })
    }
  },
}
</script>
