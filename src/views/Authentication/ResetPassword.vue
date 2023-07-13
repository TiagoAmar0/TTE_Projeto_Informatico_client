<template>
  <div class="container is-fullheight is-centered has-text-centered">
    <div class="main-form">
      <div class="has-text-centered">
        <img src="@/assets/img/logo.webp" alt="logo">
      </div>
      <div class="field">
        <div class="control">
          <input v-model="password" :disabled="processing" class="input" type="password" placeholder="Nova Password" autocomplete="new password">
        </div>
      </div>

      <div class="field">
        <div class="control">
          <input v-model="passwordConfirmation" :disabled="processing" class="input" type="password" placeholder="Confirmar Password" autocomplete="new password">
        </div>
      </div>

      <button @click="resetPassword" class="button is-block is-primary is-large is-fullwidth" :disabled="processing" :class="{ 'is-loading': processing }">
        Confirmar
      </button>

      <div class="mt-3">
        <span class="button-text mt-3 is-link" @click="$router.push({ name: 'login' })">Voltar</span>
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
      passwordConfirmation: null,
      processing: false,
    }
  },
  methods: {
    resetPassword(){
      this.processing = true
      axios.put('reset-password', { token: this.$route.query.token, password: this.password, password_confirmation: this.passwordConfirmation })
          .then(() => {
            this.$toast.success('A password foi atualizada')
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
