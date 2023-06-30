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
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-background {
  background-color: rgba(0, 0, 0, 0.5);
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  position: fixed;
}

.modal-content {
  max-width: 400px;
  width: 100%;
  background-color: #fff;
}

.box {
  padding: 1.4rem;
}

.buttons {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
}
</style>
