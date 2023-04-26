<template>
  <div>
    <div class="table-container">
      <table class="table is-fullwidth is-striped">
        <thead>
        <tr>
          <th>Início</th>
          <th>Fim</th>
          <th>Estado</th>
          <th>Ações</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="schedule in paginatedSchedules" :key="schedule.id">
          <td>{{ schedule.start }}</td>
          <td>{{ schedule.end }}</td>
          <td>{{ schedule.draft ? 'Rascunho' : 'Lançado' }}</td>
          <td>
            <button class="button is-primary mx-1" @click="$router.push({ name: 'service.show', params: {id: schedule.service_id,  schedule: schedule.id }})">
              <i class="fas fa-eye"></i>
            </button>
            <button class="button is-warning mx-1" @click="$router.push({ name: 'service.schedules.edit', params: { id: schedule.service_id, schedule: schedule.id }})">
              <i class="fas fa-pencil"></i>
            </button>
            <button class="button is-danger mx-1" @click="scheduleToDelete = schedule; showDeleteModal = true">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <nav class="pagination" role="navigation" aria-label="pagination">
      <ul class="pagination-list">
        <li v-for="pageNumber in totalPages" :key="pageNumber">
          <a class="pagination-link" :class="{ 'is-current': page === pageNumber }" @click="goToPage(pageNumber)">{{ pageNumber }}</a>
        </li>
      </ul>
    </nav>
    <confirmDeleteModal v-if="showDeleteModal" @confirm-delete="destroy" @cancel-delete="scheduleToDelete = null; showDeleteModal = false" />
  </div>
</template>

<script>
import axios from "axios";
import ConfirmDeleteModal from "@/components/Layout/Dashboard/ConfirmDeleteModal.vue";

export default {
  name: 'schedules-table',
  props: ['schedules'],
  components: { ConfirmDeleteModal },
  data(){
    return {
      page: 1,
      showDeleteModal: false,
      perPage: 10,
      scheduleToDelete: null,
    }
  },
  methods: {
    goToPage(pageNumber) {
      this.page = pageNumber;
    },
    destroy(){
      axios.delete(`services/${this.$route.params.id}/schedules/${this.scheduleToDelete.id}`)
          .then(response => {
            this.$toast.success(response.data.message)
            this.$emit('reload')
          })
          .catch(error => {
            console.log(error)
            this.$toast.error(error.response.data.message)
          })
          .finally(() => {
            this.scheduleToDelete = null;
            this.showDeleteModal = false
          })
    },
  },
  computed: {
    paginatedSchedules() {
      const start = (this.page - 1) * this.perPage;
      const end = start + this.perPage;
      return this.schedules.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.schedules.length / this.perPage);
    },
  },
}
</script>