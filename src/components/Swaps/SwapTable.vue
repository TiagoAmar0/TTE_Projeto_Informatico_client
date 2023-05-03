<template>
  <div class="table-container">
    <table class="table is-fullwidth is-striped">
      <thead>
        <tr>
          <td>Nome</td>
          <td>Turno a pedir troca</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="swap in swaps">
          <td>{{ swap.user.name }}</td>
          <td>{{ swap.shift.name }}</td>
          <td>
            <button class="button is-info">Pedir Troca</button>
          </td>
        </tr>
      <tr v-for="user in users_with_dayoff">
        <td>{{ user.name }}</td>
        <td>Folga</td>
        <td>
          <button class="button is-info">Pedir Troca</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'swap-table',
  props: ['swaps', 'users_with_dayoff']
}
</script>
