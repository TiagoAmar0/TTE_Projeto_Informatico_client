<template>
  <main class="dashboard">
      <div>
        <Navbar/>
        <section class="section">
          <div class="card" v-if="showCard">
            <div class="card-content">
              <h1 class="is-size-3">{{ title }}</h1>
              <hr>
              <slot />
            </div>
          </div>
          <slot v-else />
        </section>
      </div>
  </main>
</template>

<script>
import Navbar from "@/components/Layout/Dashboard/Navbar.vue";

export default {
  name: 'Dashboard',
  components: {Navbar},
  props: {
    title: String,
    showCard: {
      type: Boolean,
      required: false,
      default: true
    },
  }
};
</script>

<style>
.dashboard {
  min-height: 100vh;
  background: #f2f2f2;
  padding-top: 4rem;
}
</style>
