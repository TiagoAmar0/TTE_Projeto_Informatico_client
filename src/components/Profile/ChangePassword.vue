<template>
  <div>
    <h3 class="is-size-5">Alterar Senha:</h3>
    <form @submit.prevent="changePassword">
      <div class="column">
        <div class="control has-icons-left">
          <input :disabled="processing" class="input is-small" type="password" placeholder="Senha atual" v-model="form.current_password">
          <span class="icon is-small is-left">
              <i class="fas fa-key"></i>
            </span>
        </div>
      </div>
      <div class="column">
        <div class="control has-icons-left">
          <input :disabled="processing" class="input is-small" type="password" placeholder="Nova senha" v-model="form.new_password">
          <span class="icon is-small is-left">
              <i class="fas fa-key"></i>
            </span>
        </div>
      </div>
      <div class="column">
        <div class="control has-icons-left">
          <input :disabled="processing" class="input is-small" type="password" placeholder="Confirmar nova senha" v-model="form.new_password_confirmation">
          <span class="icon is-small is-left">
            <i class="fas fa-key"></i>
          </span>
        </div>
      </div>
      <div class="column">
        <button :disabled="processing" :class="{ 'is-loading': processing }" class="button is-primary" type="submit">
          Alterar Senha
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'profile-change-password',
  data() {
    return {
      processing: false,
      form: {
        current_password: null,
        new_password: null,
        new_password_confirmation: null,
      }
    }
  },
  methods: {
    changePassword(){
      axios.put('password', this.form)
          .then(() => {
            this.$toast.success('A senha foi atualizada')
          })
          .catch(error => {
            this.$toast.error(error.response.data.message)
          })
          .finally(() => {
            this.processing = false
            this.cleanForm()
          })
    },
    cleanForm(){
      this.form.new_password = null;
      this.form.new_password_confirmation = null;
      this.form.current_password = null;
    }
  }
}
</script>
