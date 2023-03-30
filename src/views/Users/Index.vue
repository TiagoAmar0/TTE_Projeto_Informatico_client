<template>
  <DashboardLayout :title="'Utilizadores (' + $store.getters.usersTotal + ')'">
    <RouterLink :to="{ name: 'users.add' }">
      <button class="button is-primary mb-4">
        Adicionar Utilizador
      </button>
    </RouterLink>
    <UsersTable />
  </DashboardLayout>
</template>


<script>
import DashboardLayout from "@/layouts/DashboardLayout.vue"
import UsersTable from "@/components/Users/UsersTable.vue";
export default {
  name: 'users-index',
  components: { UsersTable, DashboardLayout },
}
</script>
