<template>
  <div id="auth-container" class="is-fullheight hero is-flex-direction-row">
    <div class="hero-body is-justify-content-center is-align-items-center is-flex-grow-1">
      <div class="columns is-flex is-flex-direction-column box is-mobile">
        <div class="column" style="text-align: center">
          <h1 class="is-size-4">
            Plataforma TTE
          </h1>
        </div>
        <form @submit.prevent="login" v-if="!forgotPasswordForm">
          <div class="column">
            <div class="control has-icons-left">
              <input :disabled="processing" class="input is-small" type="email" placeholder="Email" v-model="email">
              <span class="icon is-small is-left">
              <i class="fas fa-envelope"></i>
            </span>
            </div>
          </div>
          <div class="column">
            <div class="control has-icons-left">
              <input :disabled="processing" class="input is-small" type="password" placeholder="Password" v-model="password">
              <span class="icon is-small is-left">
              <i class="fas fa-key"></i>
            </span>
            </div>
          </div>
          <div class="column">
            <button :disabled="processing" :class="{ 'is-loading': processing }" class="button is-primary is-fullwidth" type="submit">
              Login
            </button>
            <button class="button is-link is-light mt-2 is-fullwidth" @click="openForgotForm">Esqueci-me da senha</button>
          </div>
        </form>
        <form @submit.prevent="forgotPassword" v-else>
          <div v-if="!forgotFormSent">
            <div class="column">
              <div class="control has-icons-left">
                <input :disabled="processing" class="input is-small" type="email" placeholder="Email" v-model="forgotPasswordEmail">
                <span class="icon is-small is-left">
              <i class="fas fa-envelope"></i>
            </span>
              </div>
            </div>
            <div class="column">
              <button :disabled="processing" :class="{ 'is-loading': processing }" class="button is-primary is-fullwidth" type="submit">
                Recuperar Senha
              </button>
              <button class="button is-link is-light mt-2  is-fullwidth" :disabled="processing" @click="backForgotForm">Voltar</button>
            </div>
          </div>
          <div v-else style="text-align: center">
                <p>Foi enviado um email para recuperar o acesso.</p>
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
      email: null,
      password: null,
      processing: false,
      forgotPasswordForm: false,
      forgotPasswordEmail: null,
      forgotFormSent: false
    }
  },
  methods: {
    login () {
      this.processing = true
      this.$store.dispatch('login', { email: this.email, password: this.password })
          .then(() => {
            this.$toast.success('Sessão iniciada')
            this.$router.push({ name: 'dashboard' })
          })
          .catch((error) => {
            this.password = null
            this.$toast.error(error.response.data.message)
          })
          .finally(() => {
            this.processing = false
          })
    },
    forgotPassword(){
      this.processing = true
      axios.post(`/forgot-password`, { email: this.forgotPasswordEmail })
          .then(() => {
            this.forgotFormSent = true
          })
          .catch(error => console.log(error))
          .finally(() => {
            this.processing = false
          })
    },
    openForgotForm(){
      this.email = null;
      this.password = null;
      this.forgotPasswordForm = true;
    },
    backForgotForm(){
      this.forgotPasswordForm = false;
      this.forgotPasswordEmail = null
    }
  },
  mounted(){
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
