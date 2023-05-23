<template>
  <div class="card is-fullheight">
    <div class="card-content has-text-centered">
      <h1 v-if="title" class="is-size-4">{{ title }}</h1>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'item-card',
  props: ['title']
}
</script>

<style>
.card {
  height: 100%;
}
</style>
