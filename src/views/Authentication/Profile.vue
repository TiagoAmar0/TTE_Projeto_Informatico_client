<template>
  <DashboardLayout title="O meu perfil">
    <profile-general-info />
    <hr>
    <profile-change-password />
  </DashboardLayout>
</template>

<script>
import DashboardLayout from "@/layouts/DashboardLayout.vue"
import ProfileGeneralInfo from "@/components/Profile/GeneralInfo.vue";
import ProfileChangePassword from "@/components/Profile/ChangePassword.vue";

export default {
  name: 'profile',
  components: {ProfileChangePassword, ProfileGeneralInfo, DashboardLayout },
  data(){
    return {

    }
  },
  computed: {
    user(){
      return this.$store.getters.authUser
    }
  }
}
</script>
