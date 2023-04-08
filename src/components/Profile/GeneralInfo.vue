<template>
  <div>
    <div class="field">
      <label class="label">Nome:</label>
      <div class="control">
        <input class="input" type="text" disabled :value="user.name">
      </div>
    </div>
    <div class="field">
      <label class="label">Email:</label>
      <div class="control">
        <input class="input" type="text" disabled :value="user.email">
      </div>
    </div>
    <div class="field">
      <label class="label">Cargo:</label>
      <div class="control">
        <input class="input" type="text" disabled :value="user.type_normalized">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'profile-general-info',
  computed: {
    user(){
     return this.$store.getters.authUser ? this.$store.getters.authUser : {
       name: '',
       email: '',
       type_normalized: ''
     }
    }
  }
}
</script>
