<template>
  <DashboardLayout title="Adicionar Turno">
    <form @submit.prevent="store">
      <div class="field">
        <label class="label">Abreviatura</label>
        <div class="control">
          <input class="input" type="text" v-model="form.name" />
        </div>
      </div>
      <div class="field">
        <label class="label">Descrição</label>
        <div class="control">
          <input class="input" type="text" v-model="form.description" />
        </div>
      </div>
      <div class="field">
        <label class="label">Início</label>
        <div class="control">
          <input class="input" v-maska data-maska="##:##" v-model="form.start">
        </div>
      </div>
      <div class="field">
        <label class="label">Fim</label>
        <div class="control">
          <input class="input" v-maska data-maska="##:##" v-model="form.end">
        </div>
      </div>
      <div class="field">
        <label class="label">Horas</label>
        <div class="control">
          <input class="input" v-maska data-maska="##:##" v-model="form.end">
        </div>
      </div>
      <div class="field">
        <div class="control">
          <button type="submit" class="button is-primary mr-2">Adicionar</button>
          <button class="button is-primary is-light mb-4" @click="$router.push({ name: 'service.shifts' })">
            Cancelar
          </button>
        </div>
      </div>



    </form>
  </DashboardLayout>
</template>

<script>
import DashboardLayout from "@/layouts/DashboardLayout.vue";

export default {
  name: 'service-shifts-add',
  components: { DashboardLayout },
  data(){
    return {
      form: {
        name: '',
        description: '',
        start: '00:00',
        end: '00:00',
        hours: '00:00',
        nurses_qty: 0,
      }
    }
  },
  methods: {
    store(){
      console.log('store')
    }
  }
}
</script>