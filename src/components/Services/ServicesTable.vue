<template>
  <div>
    <div class="field is-grouped">
      <p class="control is-expanded">
        <input class="input" type="text" v-model="search" placeholder="Procurar...">
      </p>
    </div>
    <div class="table-container">
      <table class="table is-fullwidth is-striped">
        <thead>
        <tr>
          <th>Nome</th>
          <th>Ações</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="service in paginatedServices" :key="service.id">
          <td>{{ service.name }}</td>
          <td>
            <button class="button is-primary mx-1" @click="$router.push({ name: 'service.show', params: { id: service.id }})">
              <i class="fas fa-eye"></i>
            </button>
            <button class="button is-warning mx-1" @click="$router.push({ name: 'service.edit', params: { id: service.id }})">
              <i class="fas fa-pencil"></i>
            </button>
            <button class="button is-danger mx-1" @click="serviceToDelete = service; showDeleteModal = true">
              <i class="fas fa-trash"></i>
            </button>
            <button class="button is-dark mx-1" @click="$router.push({ name: 'service.schedules', params: { id: service.id }})">
              <i class="fas fa-clock"></i>
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
    <confirmDeleteModal v-if="showDeleteModal" @confirm-delete="destroy" @cancel-delete="serviceToDelete = null; showDeleteModal = false" />
  </div>
</template>

<script>
import confirmDeleteModal from "@/components/Layout/Dashboard/ConfirmDeleteModal.vue";
export default {
  name: 'services-table',
  components: { confirmDeleteModal },
  data() {
    return {
      search: '',
      page: 1,
      perPage: 10,
      serviceToDelete: null,
      showDeleteModal: false
    };
  },
  computed: {
    filteredServices(){
      // Filter by search string ignoring accents and case
      return this.$store.getters.services.filter(s => s.name
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .includes(
                this.search
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase())
      )
    },
    totalPages() {
      return Math.ceil(this.filteredServices.length / this.perPage);
    },
    paginatedServices() {
      const start = (this.page - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredServices.slice(start, end);
    },
  },
  methods: {
    destroy(){
      this.$store.dispatch('deleteService', this.serviceToDelete)
          .then(() => {
            this.serviceToDelete = null
            this.showDeleteModal = false
            this.$toast.success('Serviço eliminado')
          })
          .catch(error => {
            this.$toast.error(error.response.data.message)
          })
    },
    goToPage(pageNumber) {
      this.page = pageNumber;
    },

  },
  watch: {
    paginatedServices(){
      if(this.paginatedServices.length === 0 && this.page > 0)
        this.page--
    }
  }
};
</script>
