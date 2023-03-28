<template>
  <div>
    <div class="field is-grouped">
      <p class="control is-expanded">
        <input class="input" type="text" v-model="search" placeholder="Procurar...">
      </p>
    </div>
    <table class="table is-fullwidth">
      <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="service in services" :key="service.id">
        <td>{{ service.id }}</td>
        <td>{{ service.name }}</td>
        <td></td>
      </tr>
      </tbody>
    </table>
    <nav class="pagination" role="navigation" aria-label="pagination">
      <ul class="pagination-list">
        <li v-for="pageNumber in totalPages" :key="pageNumber">
          <a class="pagination-link" :class="{ 'is-current': page === pageNumber }" @click="goToPage(pageNumber)">{{ pageNumber }}</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'services-table',
  data() {
    return {
      services: [],
      search: '',
      page: 1,
      perPage: 10,
      totalRecords: 0,
      totalPages: 1
    };
  },
  mounted() {
    this.loadServices();
  },
  methods: {
    loadServices() {
      this.$store.dispatch('loadServices', { page: this.page, search: this.search })
          .then(() => {
            this.services = this.$store.getters.services
            this.totalRecords = this.$store.getters.totalServices
            this.totalPages = Math.ceil(this.totalRecords / this.perPage);
          })
          .catch(() => {
            this.$toast.error('Erro ao carregar os serviços')
          })
    },
    prevPage() {
      this.page--;
      this.loadServices();
    },
    nextPage() {
      this.page++;
      this.loadServices();
    },
    goToPage(pageNumber) {
      this.page = pageNumber;
      this.loadServices();
    },
  },
  watch: {
    search(){
      this.loadServices()
    },
  }
};
</script>
