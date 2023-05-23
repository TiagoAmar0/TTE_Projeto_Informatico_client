<template>
  <div class="card">
    <div :class="cardClass" >
      <h1 v-if="title" class="is-size-4">{{ title }}</h1>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'item-card',
  props: ['title', 'is_dashboard'],
  computed: {
    cardClass(){
      if(this.is_dashboard)
        return 'card-content has-text-centered is-flex is-flex-direction-column is-justify-content-center is-align-items-center'

      return 'card-content has-text-centered'
    }
  }
}
</script>

<style scoped>
.card {
  height: 100%;
  min-height: 9rem;
}
</style>
