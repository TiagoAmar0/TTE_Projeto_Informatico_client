<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <p>Tem a certeza que pretende eliminar este registo?</p>
        <div class="buttons">
          <button class="button is-danger" @click="confirmDelete">Apagar</button>
          <button class="button" @click="cancelDelete">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'confirm-delete-modal',
  methods: {
    confirmDelete() {
      this.$emit('confirm-delete');
    },
    cancelDelete() {
      this.$emit('cancel-delete');
    }
  }
};
</script>

<style scoped>
/* modal styles */
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fff;
  max-width: 400px;
  width: 100%;
}

.box {
  padding: 1.5rem;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}
</style>
