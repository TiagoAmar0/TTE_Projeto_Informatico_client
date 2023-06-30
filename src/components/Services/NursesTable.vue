<template>
  <div>
    <article class="message is-warning my-2" v-if="!leadNurses.length">
      <div class="message-header">
        <p>Aviso</p>
      </div>
      <div class="message-body">
        Não existe um enfermeiro chefe associado a este serviço
      </div>
    </article>
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
        <tr v-for="leadNurse in leadNurses" :key="leadNurse.id">
          <td>{{ leadNurse.name }}</td>
          <td>Enfermeiro Chefe</td>
          <td>
            <button :disabled="processing" class="button is-danger" @click="$emit('disassociate', leadNurse.id)">
              <i class="fas fa-minus"></i>
            </button>
          </td>
        </tr>
        <tr v-for="nurse in nurses" :key="nurse.id">
          <td>{{ nurse.name }}</td>
          <td>Enfermeiro</td>
          <td>
            <button :disabled="processing" class="button is-danger" @click="$emit('disassociate', nurse.id)">
              <i class="fas fa-minus"></i>
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
  name: 'service-nurses-table',
  props: ['nurses', 'processing'],
  computed: {
    leadNurses(){
      return this.nurses.filter(n => n.type === 'lead-nurse')
    },
    nurses(){
      return this.nurses.filter(n => n.type === 'nurse')
    }
  }
};
</script>
