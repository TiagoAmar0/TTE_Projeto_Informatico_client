<template>
  <nav class="navbar is-fixed-top is-transparent" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <RouterLink :to="{ name: 'dashboard' }" class="navbar-item">
        <img src="@/assets/img/logo.png" height="253" style="max-height: 3rem;">
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

        <RouterLink :to="{ name: 'services' }" class="navbar-item">
          Serviços
        </RouterLink>
        <a class="navbar-item">
          Utilizadores
        </a>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <span class="button is-primary" @click="logout">
              <strong>Terminar Sessão</strong>
            </span>
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
      show: false
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
          .then(() => {
            this.$toast.success('Sessão terminada')
            this.$router.push({ name: 'login' })
          })
    }
  }
}
</script>
