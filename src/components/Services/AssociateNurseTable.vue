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
          <th>Função</th>
          <th>Ações</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="ln in filteredLeadNurses" :key="ln.id">
          <td>{{ ln.name }}</td>
          <td>Enfermeiro Chefe</td>
          <td>
            <button class="button is-success" @click="$emit('associate', ln.id)">
              <i class="fas fa-plus"></i>
            </button>
          </td>
        </tr>
        <tr v-for="rn in filteredRegularNurses" :key="rn.id">
          <td>{{ rn.name }}</td>
          <td>Enfermeiro</td>
          <td>
            <button class="button is-success" @click="$emit('associate', rn.id)">
              <i class="fas fa-plus"></i>
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
export default {
  name: 'associate-nurse-table',
  props: ['nurses'],
  data(){
    return {
      search: ''
    }
  },
  computed: {
    leadNurses(){
      return this.nurses.filter(n => n.type === 'lead-nurse')
    },
    regularNurses(){
      return this.nurses.filter(n => n.type === 'nurse')
    },
    filteredLeadNurses(){
      return this.leadNurses.filter(s => s.name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .includes(
              this.search
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase()))
    },
    filteredRegularNurses(){
      return this.regularNurses.filter(s => s.name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .includes(
              this.search
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase()))
    },
  }


}
</script>
