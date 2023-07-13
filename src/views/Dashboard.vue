<template>
  <DashboardLayout title="Dashboard" :show-card="false">

    <div class="columns">
      <div class="column is-one-fourth" v-if="user && user.service_id">
        <item-card :isDashboard="true">
          <h1 class="is-size-4" v-if="user.type !== 'admin'">
            {{ user.type === 'lead-nurse' ? 'Enfermeiro Chefe' : 'Enfermeiro'}}: {{ user.service }}
          </h1>
          <h1 class="is-size-4" v-else>Administrador</h1>
        </item-card>
      </div>
      <div class="column is-one-fourth pointable"
           v-if="user && user.type === 'lead-nurse' && user.service_id"
           @click="$router.push({ name: 'service.show', params: { id: user.service_id }})"
      >
        <item-card :isDashboard="true">
          <h1 class="is-size-4">O meu serviço</h1>
        </item-card>
      </div>
      <div class="column is-one-fourth pointable"
           v-if="user && user.type === 'nurse'"
           @click="this.$router.push({ name: 'swaps.sent' })">
        <item-card :isDashboard="true">
          <h1 class="is-size-4">Pedidos de troca enviados</h1>
          <h1 class="is-size-2">{{ pendingSwapsProposedByUser }}</h1>
        </item-card>
      </div>
      <div class="column is-one-fourth pointable"
           v-if="user && user.type === 'admin'"
           @click="this.$router.push({ name: 'users' })">
        <item-card :isDashboard="true">
          <h1 class="is-size-4">Utilizadores</h1>
        </item-card>
      </div>
      <div class="column is-one-fourth pointable"
           v-if="user && user.type === 'admin'"
           @click="this.$router.push({ name: 'services' })">
        <item-card :isDashboard="true">
          <h1 class="is-size-4">Serviços</h1>
        </item-card>
      </div>
      <div class="column is-one-fourth pointable" @click="this.$router.push({ name: 'profile' })" v-if="user && user.type === 'admin'">
        <item-card :isDashboard="true" >
          <h1 class="is-size-4">Perfil</h1>
        </item-card>
      </div>
      <div class="column is-one-fourth pointable"
           v-if="user && user.type === 'nurse'"
           @click="this.$router.push({ name: 'swaps.received' })">
        <item-card :isDashboard="true">
            <h1 class="is-size-4">Pedidos de troca recebidos</h1>
            <h1 class="is-size-2">{{ pendingSwapsProposedToUser }}</h1>
        </item-card>
      </div>
      <div class="column is-one-fourth pointable"
           v-if="user && user.type === 'lead-nurse'"
           @click="this.$router.push({ name: 'service.schedules', params: { id: user.service_id} })">
        <item-card :isDashboard="true">
          <h1 class="is-size-4">Horários</h1>
        </item-card>
      </div>
    </div>

    <div class="columns">
      <div class="column is-one-fourth pointable"
           v-if="user && user.type === 'nurse'"
           @click="this.$router.push({ name: 'swaps.propose' })">
        <item-card :isDashboard="true">
          <h1 class="is-size-4">Pedir troca</h1>
        </item-card>
      </div>
      <div class="column is-one-fourth pointable"
           v-if="user && user.type === 'nurse'"
           @click="this.$router.push({ name: 'swaps.history' })">
        <item-card :isDashboard="true">
          <h1 class="is-size-4">Histórico de trocas</h1>
        </item-card>
      </div>
      <div class="column is-one-fourth pointable"
           v-if="user && user.type !== 'admin'"
           @click="this.$router.push({ name: 'user.shifts' })">
        <item-card :isDashboard="true">
          <h1 class="is-size-4">O meu horário</h1>
        </item-card>
      </div>
      <div class="column is-one-fourth pointable" @click="this.$router.push({ name: 'profile' })" v-if="user && user.type !== 'admin'">
        <item-card :isDashboard="true" >
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

<style>
  .pointable {
    cursor: pointer;
  }
</style>
