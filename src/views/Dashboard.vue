<template>
  <DashboardLayout title="Dashboard" :show-card="false">

    <div class="columns">
      <div class="column is-one-fifth" v-if="user">
        <div class="card">
          <div class="card-content">
          <h1 class="is-size-4">Permissões: {{ user.type_normalized }}</h1>
          </div>
        </div>
      </div>
      <div class="column is-two-fifths">
        <swaps-proposed-by-user-table />
      </div>
      <div class="column is-two-fifths">
        <swaps-proposed-to-user-table />
      </div>
    </div>

    <div class="columns">
      <div class="column is-two-fifths">
        <shifts-allocated-to-user-table />
      </div>
    </div>

  </DashboardLayout>
</template>

<script>
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import SwapsProposedByUserTable from "@/components/Swaps/SwapsProposedByUserTable.vue";
import SwapsProposedToUserTable from "@/components/Swaps/SwapsProposedToUserTable.vue";
import ShiftsAllocatedToUserTable from "@/components/ShiftsAllocatedToUserTable.vue";

export default {
  components: {ShiftsAllocatedToUserTable, SwapsProposedToUserTable, SwapsProposedByUserTable, DashboardLayout},
  layout: 'dashboard',
  computed: {
    user(){
      return this.$store.getters.authUser
    }
  },
}
</script>
