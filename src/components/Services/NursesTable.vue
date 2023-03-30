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
        <tr v-for="ln in leadNurses" :key="ln.id">
          <td>{{ ln.name }}</td>
          <td>Enfermeiro Chefe</td>
          <td>
            <button class="button is-danger" @click="$emit('disassociate', ln.id)">
              <i class="fas fa-minus"></i>
            </button>
          </td>
        </tr>
        <tr v-for="rn in regularNurses" :key="rn.id">
          <td>{{ rn.name }}</td>
          <td>Enfermeiro</td>
          <td>
            <button class="button is-danger" @click="$emit('disassociate', rn.id)">
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
  props: ['nurses'],
  computed: {
    leadNurses(){
      return this.nurses.filter(n => n.type === 'lead-nurse')
    },
    regularNurses(){
      return this.nurses.filter(n => n.type === 'nurse')
    }
  }
};
</script>
