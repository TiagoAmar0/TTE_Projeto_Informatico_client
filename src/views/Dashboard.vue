<template>
  <DashboardLayout title="Dashboard" :show-card="false">

    <div class="columns">
      <div class="column is-one-fourth" v-if="user">
        <item-card :title="`Bem vindo(a) ${user.type_normalized} ${user.name}`" />
      </div>
      <div class="column is-one-fourth"
           v-if="user && user.type !== 'admin'"
           @click="this.$router.push({ name: 'swaps.sent' })">
        <item-card :is_dashboard="true">
          <h1 class="is-size-4">Pedidos de troca enviados</h1>
          <h1 class="is-size-2">{{ pendingSwapsProposedByUser }}</h1>
        </item-card>
      </div>
      <div class="column is-one-fourth"
           v-if="user && user.type !== 'admin'"
           @click="this.$router.push({ name: 'swaps.received' })">
        <item-card :is_dashboard="true">
            <h1 class="is-size-4">Pedidos de troca recebidos</h1>
            <h1 class="is-size-2">{{ pendingSwapsProposedToUser }}</h1>
        </item-card>
      </div>
      <div class="column is-one-fourth"
           v-if="user && user.type !== 'admin'"
           @click="this.$router.push({ name: 'swaps.propose' })">
        <item-card :is_dashboard="true">
          <h1 class="is-size-4">Pedir troca</h1>
        </item-card>
      </div>
    </div>

    <div class="columns">
      <div class="column is-one-fourth"
           v-if="user && user.type !== 'admin'"
           @click="this.$router.push({ name: 'swaps.history' })">
        <item-card :is_dashboard="true">
          <h1 class="is-size-4">Histórico de trocas</h1>
        </item-card>
      </div>
      <div class="column is-one-fourth"
           v-if="user && user.type !== 'admin'"
           @click="this.$router.push({ name: 'user.shifts' })">
        <item-card :is_dashboard="true">
          <h1 class="is-size-4">Os meus turnos</h1>
        </item-card>
      </div>
      <div class="column is-one-fourth" @click="this.$router.push({ name: 'profile' })">
        <item-card :is_dashboard="true" >
          <h1 class="is-size-4">Perfil</h1>
        </item-card>
      </div>
    </div>

  </DashboardLayout>
</template>

<script>
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import ItemCard from "@/components/Dashboard/ItemCard.vue";
import router from "@/router";

export default {
  methods: {
    router() {
      return router
    }
  },
  components: {
    DashboardLayout, ItemCard},
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
