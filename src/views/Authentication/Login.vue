<template>
  <div id="auth-container" class="is-fullheight hero is-flex-direction-row">
    <div class="hero-body is-justify-content-center is-align-items-center is-flex-grow-1">
      <div class="columns is-flex is-flex-direction-column box is-mobile">
        <div class="column" style="text-align: center">
          <h1 class="is-size-4">
            Plataforma TTE
          </h1>
        </div>
        <form @submit.prevent="login">
          <div class="column">
            <div class="control has-icons-left">
              <input class="input is-small" type="email" placeholder="Email" v-model="email">
              <span class="icon is-small is-left">
              <i class="fas fa-envelope"></i>
            </span>
            </div>
          </div>
          <div class="column">
            <div class="control has-icons-left">
              <input class="input is-small" type="password" placeholder="Password" v-model="password">
              <span class="icon is-small is-left">
              <i class="fas fa-key"></i>
            </span>
            </div>
          </div>
          <div class="column">
            <button class="button is-primary is-fullwidth" type="submit">
              Login
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      email: null,
      password: null
    }
  },
  methods: {
    login () {
      this.$store.dispatch('login', { email: this.email, password: this.password })
          .then(() => {
            this.$toast.success('Sessão iniciada')
            this.$router.push({ name: 'dashboard' })
          })
          .catch((error) => {
            this.password = null
            // this.$toast.error(error.data.message)
          })
    }
  },
  mounted(){
    console.log(this.$store.state.user)
   if(this.$store.state.user)
     this.$router.push('/dashboard')
  }
}
</script>

<style scoped>
  #auth-container {
    background: url("@/assets/img/auth_bg.jpg");
    background-size: cover;
    background-repeat: no-repeat;
  }
</style>
