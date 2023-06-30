<template>
  <div>
    <h3 class="is-size-5">Alterar Password:</h3>
    <form @submit.prevent="changePassword">
      <div class="column">
        <div class="field">
          <label class="label">Password Atual:</label>
          <div class="control">
            <input :disabled="processing" class="input" type="password" placeholder="Password Atual" v-model="form.current_password">
          </div>
        </div>
      </div>
      <div class="column">
        <div class="field">
          <label class="label">Nova password:</label>
          <div class="control">
            <input :disabled="processing" class="input" type="password" placeholder="Nova password" v-model="form.new_password">
          </div>
        </div>
      </div>
      <div class="column">
        <div class="field">
          <label class="label">Confirmar nova password:</label>
          <div class="control">
          <input :disabled="processing" class="input" type="password" placeholder="Confirmar nova password" v-model="form.new_password_confirmation">
          </div>
        </div>
      </div>
      <div class="column">
        <button :disabled="processing" :class="{ 'is-loading': processing }" class="button is-primary" type="submit">
          Alterar Password
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
            this.$toast.success('A password foi atualizada')
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
