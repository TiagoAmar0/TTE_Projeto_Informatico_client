<template>
  <DashboardLayout title="Dashboard" :show-card="false">

    <div class="columns">
      <div class="column is-one-third" v-if="user">
        <item-card :title="'Bem vindo ' + user.type_normalized + ' ' +  user.name" />
      </div>
      <div class="column is-one-third">
        <item-card>
          <h1 class="is-size-4">Pedidos de troca enviados</h1>
          <h1 class="is-size-2">7</h1>
        </item-card>
      </div>
      <div class="column is-one-third">
        <item-card>
          <h1 class="is-size-4">Pedidos de troca recebidos</h1>
          <h1 class="is-size-2">2</h1>
        </item-card>
      </div>
    </div>
    <div class="columns">
      <div class="column is-one-third">
        <item-card>
          <h1 class="is-size-4">Histórico de trocas</h1>
        </item-card>
      </div>
      <div class="column is-one-third">
        <item-card>
          <h1 class="is-size-4">Os meus turnos</h1>
        </item-card>
      </div>
<!--      <div class="column is-two-fifths">-->
<!--        <swaps-proposed-to-user-table />-->
<!--      </div>-->
    </div>

    <div class="columns">
      <div class="column is-full">
      </div>
    </div>

  </DashboardLayout>
</template>

<script>
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import SwapsProposedByUserTable from "@/components/Swaps/SwapsProposedByUserTable.vue";
import SwapsProposedToUserTable from "@/components/Swaps/SwapsProposedToUserTable.vue";
import ShiftsAllocatedToUserTable from "@/components/ShiftsAllocatedToUserTable.vue";
import ShiftsCalendar from "@/components/Shifts/ShiftsCalendar.vue";
import ItemCard from "@/components/Dashboard/ItemCard.vue";

export default {
  components: {
    ShiftsCalendar,
    ShiftsAllocatedToUserTable, SwapsProposedToUserTable, SwapsProposedByUserTable, DashboardLayout, ItemCard},
  layout: 'dashboard',
  computed: {
    user(){
      return this.$store.getters.authUser
    }
  },
}
</script>
