<template>
  <nav class="navbar is-fixed-top is-transparent" role="navigation" aria-label="main navigation" v-if="user">
    <div class="navbar-brand">
      <RouterLink :to="{ name: 'dashboard' }" class="navbar-item">
        <img src="@/assets/img/logo.webp" height="253" style="max-height: 3rem;">
      </RouterLink>

      <a role="button" class="navbar-burger" @click="show = !show" :class="{ 'is-active': show }">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu" :class="{ 'is-active': show }">
      <div class="navbar-start">
        <RouterLink :to="{ name: 'dashboard' }" class="navbar-item">
          Dashboard
        </RouterLink>

        <RouterLink :to="{ name: 'services' }" class="navbar-item" v-if="user.type === 'admin'">
          Serviços
        </RouterLink>
        <RouterLink :to="{ name: 'users' }" class="navbar-item" v-if="user.type === 'admin'">
          Utilizadores
        </RouterLink>
        <RouterLink :to="{ name: 'service.show', params: { id: user.service_id } }" class="navbar-item" v-if="user.type === 'lead-nurse' && user.hasOwnProperty('service_id') && user.service_id">
          O meu Serviço
        </RouterLink>
        <RouterLink :to="{ name: 'swaps.propose' }" class="navbar-item" v-if="user.type === 'nurse' && user.hasOwnProperty('service_id') && user.service_id">
          Pedir Troca
        </RouterLink>
        <RouterLink :to="{ name: 'service.schedules', params: { id: user.service_id } }" class="navbar-item" v-if="user.type === 'lead-nurse' && user.hasOwnProperty('service_id') && user.service_id">
          Horários
        </RouterLink>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <button class="button" @click="$router.push({ name: 'profile' })">
              <i class="fas fa-user mr-2"></i>
              {{ user.name }}
            </button>
            <button class="button is-primary" :class="{ 'is-loading': processing }" :disabled
                ="processing" @click="logout">
              <strong>Terminar Sessão</strong>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data(){
    return {
      show: false,
      processing: false
    }
  },
  computed: {
    user(){
      return this.$store.getters.authUser
    }
  },
  methods: {
    logout() {
      this.processing = true
      this.$store.dispatch('logout')
          .then(() => {
            this.$toast.success('Sessão terminada')
            this.$router.push({ name: 'login' })
          })
          .finally(() => {
            this.processing = false
          })
    }
  }
}
</script>
