<template>
  <DashboardLayout title="Dashboard" :show-card="false">

    <div class="columns">
      <div class="column is-one-fourth" v-if="user">
        <item-card :title="`Bem vindo(a) ${user.type_normalized} ${user.name}`" />
      </div>
      <div class="column is-one-fourth">
        <item-card>
          <RouterLink :to="{ name: 'user.shifts' }"><h1 class="is-size-4">Os meus turnos</h1></RouterLink>
        </item-card>
      </div>
      <div class="column is-one-fourth">
        <item-card>
          <RouterLink :to="{ name: 'swaps.sent' }">
            <h1 class="is-size-4">Pedidos de troca enviados</h1>
            <h1 class="is-size-2">{{ pendingSwapsProposedByUser }}</h1>
          </RouterLink>
        </item-card>
      </div>
      <div class="column is-one-fourth">
        <item-card>
          <RouterLink :to="{ name: 'swaps.received' }">
            <h1 class="is-size-4">Pedidos de troca recebidos</h1>
            <h1 class="is-size-2">{{ pendingSwapsProposedToUser }}</h1>
          </RouterLink>
        </item-card>
      </div>

    </div>
    <div class="columns">


<!--      <div class="column is-two-fifths">-->
<!--        <swaps-proposed-to-user-table />-->
<!--      </div>-->
    </div>

    <div class="columns">
      <div class="column is-one-fourth">
        <item-card>
          <h1 class="is-size-4">Histórico de trocas</h1>
        </item-card>
      </div>
    </div>

  </DashboardLayout>
</template>

<script>
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import ShiftsAllocatedToUserTable from "@/components/ShiftsAllocatedToUserTable.vue";
import ItemCard from "@/components/Dashboard/ItemCard.vue";

export default {
  components: {
    ShiftsAllocatedToUserTable, DashboardLayout, ItemCard},
  layout: 'dashboard',
  computed: {
    pendingSwapsProposedToUser(){
      return this.$store.getters.pendingSwapsProposedToUser
    },
    pendingSwapsProposedByUser(){
      return this.$store.getters.pendingSwapsProposedByUser
    },
    user(){
      return this.$store.getters.authUser
    }
  },
}
</script>
