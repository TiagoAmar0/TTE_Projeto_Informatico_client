<template>
  <div id="auth-container" class="is-fullheight hero is-flex-direction-row">
    <div class="hero-body is-justify-content-center is-align-items-center is-flex-grow-1">
      <div class="columns is-flex is-flex-direction-column box is-mobile">
        <div class="column" style="text-align: center">
          <h1 class="is-size-4">
            Plataforma TTE
          </h1>
        </div>
        <form @submit.prevent="resetPassword">
          <div class="column">
            <div class="control has-icons-left">
              <input :disabled="processing" class="input is-small" type="password" placeholder="Senha" v-model="password">
              <span class="icon is-small is-left">
              <i class="fas fa-key"></i>
            </span>
            </div>
          </div>
          <div class="column">
            <div class="control has-icons-left">
              <input :disabled="processing" class="input is-small" type="password" placeholder="Confirmar Senha" v-model="password_confirmation">
              <span class="icon is-small is-left">
            <i class="fas fa-key"></i>
          </span>
            </div>
          </div>
          <div class="column">
            <button :disabled="processing" :class="{ 'is-loading': processing }" class="button is-primary is-fullwidth" type="submit">
              Definir Senha
            </button>
            <button
                :disabled="processing"
                :class="{ 'is-loading': processing }"
                class="button is-link is-light mt-2 is-fullwidth"
                @click="$router.push({ name: 'login' })">
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data () {
    return {
      password: null,
      password_confirmation: null,
      processing: false,
    }
  },
  methods: {
    resetPassword(){
      this.processing = true
      axios.put('reset-password', { token: this.$route.query.token, password: this.password, password_confirmation: this.password_confirmation })
          .then(() => {
            this.$toast.success('A senha foi atualizada')
            this.$router.push({ name: 'login' })
          })
          .catch(error => {
            this.$toast.error(error.response.data.message)
          })
          .finally(() => {
            this.processing = false
          })
    },
  },
  mounted(){
    if(!this.$route.query.token)
      this.$router.push('/login')

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
