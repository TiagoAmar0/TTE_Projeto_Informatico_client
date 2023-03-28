<!--&lt;!&ndash;<template>&ndash;&gt;-->
<!--&lt;!&ndash;  <div class="is-fullheight">&ndash;&gt;-->
<!--&lt;!&ndash;    <Navbar @logout="this.$emit" />&ndash;&gt;-->
<!--&lt;!&ndash;    <slot/>&ndash;&gt;-->
<!--&lt;!&ndash;  </div>&ndash;&gt;-->
<!--&lt;!&ndash;</template>&ndash;&gt;-->

<!--<script setup>-->
<!--import Navbar from "@/components/Layout/Dashboard/Navbar.vue";-->
<!--</script>-->
<template>
  <main class="dashboard">
      <div>
        <Navbar />
        <section class="section">
          <div class="card">
            <div class="card-content">
              <slot />
            </div>
          </div>
        </section>
      </div>
  </main>
</template>

<script>
import Navbar from "@/components/Layout/Dashboard/Navbar.vue";

export default {
  name: 'Dashboard',
  components: {Navbar},
};
</script>

<style>
.dashboard {
  height: 100vh;
  background: #f2f2f2;
  padding-top: 4rem;
}
</style>
