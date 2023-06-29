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
          <th>Email</th>
          <th>Serviço</th>
          <th>Tipo</th>
          <th>Ações</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in paginatedUsers" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.service ? user.service : 'Nenhum' }}</td>
          <td>{{ user.type_normalized }}</td>
          <td>
            <router-link :to="{ name: 'user.show', params: { id: user.id }}">
              <button class="button is-primary mx-1">
                <i class="fas fa-eye"></i>
              </button>
            </router-link>
            <router-link :to="{ name: 'user.edit', params: { id: user.id }}">
              <button class="button is-warning mx-1">
                <i class="fas fa-pencil"></i>
              </button>
            </router-link>
            <button class="button is-danger mx-1" @click="userToDelete = user; showDeleteModal = true">
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
    <confirmDeleteModal v-if="showDeleteModal" @confirm-delete="destroy" @cancel-delete="userToDelete = null; showDeleteModal = false" />
  </div>
</template>

<script>
import confirmDeleteModal from "@/components/Layout/Dashboard/ConfirmDeleteModal.vue";
export default {
  name: 'users-table',
  components: { confirmDeleteModal },
  data() {
    return {
      search: '',
      page: 1,
      perPage: 10,
      userToDelete: null,
      showDeleteModal: false
    };
  },
  computed: {
    filteredServices(){
      // Filter by search string ignoring accents and case
      return this.$store.getters.users.filter(s => s.name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .includes(
              this.search
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase())
          ||
          s.email
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .includes(
                  this.search
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase())

          ||
          s.type_normalized
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
    paginatedUsers() {
      const start = (this.page - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredServices.slice(start, end);
    },
  },
  methods: {
    destroy(){
      this.$store.dispatch('deleteUser', this.userToDelete)
          .then(() => {
            this.userToDelete = null
            this.showDeleteModal = false
            this.$toast.success('Utilizador eliminado')
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
    search(){
      this.page = 1
    },
    paginatedUsers(){
      if(this.paginatedUsers.length === 0 && this.page > 0)
        this.page--
    }
  }
};
</script>
