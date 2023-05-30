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
        <tr v-for="(user, user_id) in users" :key="user_id">
          <td>{{ user }}</td>
          <td>
            <span v-for="swap in filteredSwaps(user_id)">
              <input type="checkbox" v-model="swap.checked" @input="handleCheckChange(swap)">
              {{ swap.rest
                ? `Folgar hoje e pagar em ${swap.date} (${swap.day_of_week}) no turno ${swap.shift_name}`
                : `Troca direta para o turno ${swap.shift_name} de hoje` }}
              <br>
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
      available_swaps: []
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
    filteredSwaps(user_id){
      return this.swaps.filter(swap => swap.user_id === parseInt(user_id)).map(s => {
        return {
          ...s,
          checked: false
        }
      })
    }
  },
}
</script>
