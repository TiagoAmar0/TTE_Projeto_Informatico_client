<template>
  <section class="main hero is-primary is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-5-tablet is-4-desktop is-3-widescreen">
            <div class="box">
              <img src="@/assets/img/logo.png" alt="logo">
                <div class="field">
                  <div class="control">
                    <input v-model="password" :disabled="processing" class="input" type="password" placeholder="Nova Password" autocomplete="new password">
                  </div>
                </div>

                <div class="field">
                  <div class="control">
                    <input v-model="password_confirmation" :disabled="processing" class="input" type="password" placeholder="Confirmar Password" autocomplete="new password">
                  </div>
                </div>
                <button @click="resetPassword" class="button is-block is-primary is-large is-fullwidth" :disabled="processing" :class="{ 'is-loading': processing }">
                  Definir Password
                </button>
                <button :disabled="processing" class="button is-block is-link is-light is-large is-fullwidth mt-2"  @click="$router.push({ name: 'login' })">
                  Voltar
                </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
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
    if(!this.$route.query.token) {
      this.$router.push({ name: 'login' })
    }

    if(this.$store.state.user) {
      this.$router.push({name: 'dashboard'})

    }
  }
}
</script>

<style scoped>
.main {
  background-image: url("@/assets/img/auth_bg.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
