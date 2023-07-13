<template>
  <div class="container is-fullheight is-centered has-text-centered">
    <form @submit.prevent="login" v-if="!forgotPasswordForm" class="main-form">
      <div class="has-text-centered">
        <img src="@/assets/img/logo.webp" alt="logo">
      </div>

      <div class="field">
        <div class="control">
          <input v-model="email" :disabled="processing" class="input is-large" type="email" placeholder="Email" autocomplete="email">
        </div>
      </div>

      <div class="field">
      <div class="control">
        <input v-model="password" :disabled="processing" class="input is-large" type="password" placeholder="Password" autocomplete="password">
      </div>
    </div>
      <div class="has-text-centered">
        <button type="submit" class="button is-block is-primary is-large is-fullwidth" :disabled="processing" :class="{ 'is-loading': processing }">
          Login
        </button>
        <div class="mt-3">
          <span class="button-text mt-3 is-link" @click="openForgotForm">Esqueci-me da password</span>
        </div>

      </div>

    </form>

    <form @submit.prevent="forgotPassword" v-else class="main-form">
      <div class="has-text-centered">
        <img src="@/assets/img/logo.webp" alt="logo">
      </div>
      <div v-if="!forgotFormSent">
        <div class="field">
          <div class="control">
            <input :disabled="processing" class="input is-large" type="email" placeholder="Email" v-model="forgotPasswordEmail" autocomplete="email">
          </div>
        </div>

        <button type="submit" class="button is-block is-primary is-large is-fullwidth" :disabled="processing" :class="{ 'is-loading': processing }">
          Recuperar
        </button>
        <div class="mt-3">
          <span class="button-text mt-3 is-link" @click="backForgotForm">Voltar</span>
        </div>
      </div>
      <div v-else style="text-align: center">
        <p>Foi enviado um email para recuperar o acesso.</p>
      </div>
    </form>

  </div>



</template>

<script>
import axios from "axios";

export default {
  data () {
    return {
      isMobile: false,
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
          .catch(error => {
            this.$toast.error(error.response.data.message)
          })
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
    },
    checkScreenSize(){
      this.isMobile = window.innerWidth < 1024;
    }
  },
  mounted(){
  this.checkScreenSize();
   if(this.$store.state.user)
     this.$router.push({ name: 'dashboard' })
  }
}
</script>

<style scoped>
  .main-form {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .button-text {
    cursor: pointer;
  }
</style>
