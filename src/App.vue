<template>
  <RouterView />
</template>

<script>
export default {
  beforeCreate() {
    this.$store.dispatch('restoreToken')
        .then(token => {
          if(token) {
            this.$store.dispatch('refresh')
          }
        })
  }
}
</script>
