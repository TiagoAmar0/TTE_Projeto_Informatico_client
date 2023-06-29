<template>
  <section class="main hero is-primary is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-5-tablet is-4-desktop is-3-widescreen">
            <form class="box" @submit.prevent="login" v-if="!forgotPasswordForm">
              <img src="@/assets/img/logo.png" alt="logo">
              <div class="field">
                <div class="control">
                  <input v-model="email" :disabled="processing" class="input is-large" type="email" placeholder="Email" autocomplete="email">
                </div>
              </div>

              <div class="field">
                <div class="control">
                  <input  v-model="password" :disabled="processing" class="input is-large" type="password" placeholder="Password" autocomplete="password">
                </div>
              </div>
              <button type="submit" class="button is-block is-primary is-large is-fullwidth" :disabled="processing" :class="{ 'is-loading': processing }">
                Login
              </button>
              <button class="button is-block is-link is-light is-large is-fullwidth mt-2" @click="openForgotForm">
                Esqueci-me da senha
              </button>
            </form>

            <form @submit.prevent="forgotPassword" class="box" v-else>
              <img src="@/assets/img/logo.png" alt="logo">
                <div v-if="!forgotFormSent">
                  <div class="field">
                    <div class="control">
                      <input :disabled="processing" class="input is-large" type="email" placeholder="Email" v-model="forgotPasswordEmail" autocomplete="email">
                    </div>
                  </div>

                  <button type="submit" class="button is-block is-primary is-large is-fullwidth" :disabled="processing" :class="{ 'is-loading': processing }">
                    Recuperar Senha
                  </button>
                  <button class="button is-block is-link is-light is-large is-fullwidth mt-2" @click="backForgotForm">
                    Voltar
                  </button>
                </div>
                <div v-else style="text-align: center">
                  <p>Foi enviado um email para recuperar o acesso.</p>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
<!--    <section class="hero is-success is-fullheight" id="auth-container">-->
<!--      <div class="hero-body">-->
<!--        <div class="container has-text-centered">-->
<!--          <div class="column is-4 is-offset-4">-->
<!--            <div class="box">-->
<!--              <img src="@/assets/img/logo.png" alt="logo">-->

<!--              <form @submit.prevent="login" v-if="!forgotPasswordForm">-->
<!--                <div class="field">-->
<!--                  <div class="control">-->
<!--                    <input v-model="email" :disabled="processing" class="input is-large" type="email" placeholder="Email" autocomplete="email">-->
<!--                  </div>-->
<!--                </div>-->

<!--                <div class="field">-->
<!--                  <div class="control">-->
<!--                    <input  v-model="password" :disabled="processing" class="input is-large" type="password" placeholder="Password" autocomplete="password">-->
<!--                  </div>-->
<!--                </div>-->
<!--                <button type="submit" class="button is-block is-primary is-large is-fullwidth" :disabled="processing" :class="{ 'is-loading': processing }">-->
<!--                  Login-->
<!--                </button>-->
<!--                <button class="button is-block is-link is-light is-large is-fullwidth mt-2" @click="openForgotForm">-->
<!--                  Esqueci-me da senha-->
<!--                </button>-->
<!--              </form>-->

<!--              <form @submit.prevent="forgotPassword" v-else>-->
<!--                <div v-if="!forgotFormSent">-->
<!--                  <div class="field">-->
<!--                    <div class="control">-->
<!--                      <input :disabled="processing" class="input is-large" type="email" placeholder="Email" v-model="forgotPasswordEmail" autocomplete="email">-->
<!--                    </div>-->
<!--                  </div>-->

<!--                  <button type="submit" class="button is-block is-primary is-large is-fullwidth" :disabled="processing" :class="{ 'is-loading': processing }">-->
<!--                    Recuperar Senha-->
<!--                  </button>-->
<!--                  <button class="button is-block is-link is-light is-large is-fullwidth mt-2" @click="backForgotForm">-->
<!--                    Voltar-->
<!--                  </button>-->
<!--                </div>-->
<!--                <div v-else style="text-align: center">-->
<!--                  <p>Foi enviado um email para recuperar o acesso.</p>-->
<!--                </div>-->
<!--              </form>-->
<!--            </div>-->

<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </section>-->
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
    }
  },
  mounted(){
   if(this.$store.state.user)
     this.$router.push({ name: 'dashboard' })
  }
}
</script>

<style scoped>
  /*html,body {*/
  /*  font-family: 'Questrial', sans-serif;*/
  /*  font-size: 14px;*/
  /*  font-weight: 300;*/
  /*}*/
  /*.hero.is-success {*/
  /*  background: #F2F6FA;*/
  /*}*/
  /*.hero, .hero.is-success .nav {*/
  /*  -webkit-box-shadow: none;*/
  /*  box-shadow: none;*/
  /*}*/
  /*.box {*/
  /*  margin-top: 5rem;*/
  /*}*/

  /*input {*/
  /*  font-weight: 300;*/
  /*}*/
  /*p {*/
  /*  font-weight: 700;*/
  /*}*/

  /*.field{*/
  /*  padding-bottom: 10px;*/
  /*}*/

  /*#auth-container {*/
  /*  background: url("@/assets/img/auth_bg.jpg");*/
  /*  background-size: cover;*/
  /*  background-repeat: no-repeat;*/
  /*}*/

  body,
  html {
    /*overflow: hidden;*/

  }

  /*.auth-bg {*/
  /*  height: 100vh;*/
  /*  background-image: url("@/assets/img/auth_bg.jpg");*/
  /*  background-size: cover;*/
  /*  background-position: center;*/
  /*}*/

  /*.auth-container {*/
  /*  display: flex;*/
  /*  align-items: center;*/
  /*  justify-content: center;*/
  /*  height: 100%;*/
  /*}*/

  .main {
    background-image: url("@/assets/img/auth_bg.jpg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>
