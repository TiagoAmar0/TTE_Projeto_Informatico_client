<template>
  <DashboardLayout title="Associar enfermeiros">
    <RouterLink :to="{ name: 'service.show', params: { id: $route.params.id } }">
      <button class="button is-primary is-light mb-4">
        Voltar
      </button>
    </RouterLink>
    <associate-nurse-table :nurses="nursesWithoutService" @associate="associate" />
  </DashboardLayout>
</template>

<script>

import DashboardLayout from "@/layouts/DashboardLayout.vue";
import AssociateNurseTable from "@/components/Services/AssociateNurseTable.vue";

export default {
  name: 'service-associate-nurses',
  components: {AssociateNurseTable, DashboardLayout },
  computed: {
    nursesWithoutService(){
      return this.$store.getters.usersWithoutService
    }
  },
  methods: {
    associate(userId){
      this.$store.dispatch('associateUserToService', { service: this.$route.params.id, user: userId})
          .then(() => {
            this.$toast.success('O enfermeiro foi associado ao serviço')
          })
          .catch(error => {
            if(error.hasOwnProperty('response'))
              this.$toast.error(error.response.data.message)
          })
    },
  }
}
</script>
