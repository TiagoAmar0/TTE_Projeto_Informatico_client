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
        <tr v-for="leadNurse in filteredLeadNurses" :key="leadNurse.id">
          <td>{{ leadNurse.name }}</td>
          <td>Enfermeiro Chefe</td>
          <td>
            <button :disabled="processing" class="button is-success" @click="$emit('associate', leadNurse.id)">
              <i class="fas fa-plus"></i>
            </button>
          </td>
        </tr>
        <tr v-for="nurse in filteredNurses" :key="nurse.id">
          <td>{{ nurse.name }}</td>
          <td>Enfermeiro</td>
          <td>
            <button :disabled="processing" class="button is-success" @click="$emit('associate', nurse.id)">
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
  props: ['nurses', 'processing'],
  data(){
    return {
      search: ''
    }
  },
  computed: {
    leadNurses(){
      return this.nurses.filter(nurse => nurse.type === 'lead-nurse')
    },
    nurses(){
      return this.nurses.filter(nurse => nurse.type === 'nurse')
    },
    filteredLeadNurses(){
      return this.leadNurses.filter(nurse => nurse.name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .includes(
              this.search
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .toLowerCase()))
    },
    filteredNurses(){
      return this.nurses.filter(nurse => nurse.name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .includes(
              this.search
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, '')
                  .toLowerCase()))
    },
  }


}
</script>
