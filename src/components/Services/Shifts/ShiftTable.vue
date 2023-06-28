<template>
  <div class="table-container">
    <table class="table is-fullwidth is-striped">
      <thead>
      <tr>
        <th>Abreviatura</th>
        <th>Descrição</th>
        <th>Início</th>
        <th>Fim</th>
        <th>Duração</th>
        <th>Enfermeiros</th>
        <th>Ações</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="shift in shifts" :key="shift.id">
        <td>{{ shift.name }}</td>
        <td>{{ shift.description }}</td>
        <td>{{ shift.start }}</td>
        <td>{{ shift.end }}</td>
        <td>{{ shift.hours }}</td>
        <td>{{ shift.nurses_qty }}</td>
        <td>
          <button class="button is-small is-warning mx-1" @click="$router.push({ name: 'service.shift.edit', params: { id: $route.params.id, shift: shift.id }})">
            <i class="fas fa-pencil"></i>
          </button>
          <button class="button is-small is-danger mx-1" @click="shiftToDelete = shift; showDeleteModal = true">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
      </tbody>
    </table>
    <confirmDeleteModal v-if="showDeleteModal" @confirm-delete="destroy" @cancel-delete="shiftToDelete = null; showDeleteModal = false" />

  </div>
</template>

<script>
import ConfirmDeleteModal from "@/components/Layout/Dashboard/ConfirmDeleteModal.vue";
import axios from "axios";

export default {
  name: 'service-shifts-table',
  components: {ConfirmDeleteModal},
  props: ['shifts'],
  data(){
    return {
      showDeleteModal: false,
      shiftToDelete: null
    }
  },
  methods: {
    destroy(){
      axios.delete(`/services/${this.$route.params.id}/shifts/${this.shiftToDelete.id}`)
          .then((response) => {
            this.$toast.success(response.data.message)
            this.$emit('reload')
            this.shiftToDelete = null
            this.showDeleteModal = false
          })
          .catch(error => {
            this.$toast.error(error.response.data.message)
          })
    }
  }
}
</script>
