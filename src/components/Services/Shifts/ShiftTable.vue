<template>
  <div class="table-container">
    <table class="table is-fullwidth is-striped">
      <thead>
      <tr>
        <th>Abreviatura</th>
        <th>Descrição</th>
        <th>Início</th>
        <th>Fim</th>
        <th>Horas</th>
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
        <td>
<!--          <button class="button is-primary mx-1" @click="$router.push({ name: 'service.schedules.show', params: {id: schedule.service_id,  schedule: schedule.id }})">-->
<!--            <i class="fas fa-eye"></i>-->
<!--          </button>-->
<!--          <button class="button is-warning mx-1" @click="$router.push({ name: 'service.schedules.edit', params: { id: schedule.service_id, schedule: schedule.id }})">-->
<!--            <i class="fas fa-pencil"></i>-->
<!--          </button>-->
<!--          <button class="button is-danger mx-1" @click="scheduleToDelete = schedule; showDeleteModal = true">-->
<!--            <i class="fas fa-trash"></i>-->
<!--          </button>-->
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'service-shifts-table',
  props: ['shifts']
}
</script>