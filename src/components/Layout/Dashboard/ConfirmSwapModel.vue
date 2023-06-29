<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <p>Tem a certeza que pretende {{ action === 'approve' ? 'aprovar' : 'rejeitar' }} esta troca?</p>
        <div class="buttons">
          <button class="button" :class="{
            'is-success': action === 'approve',
            'is-danger': action === 'reject',
          }" @click="confirm">Sim</button>
          <button class="button" @click="cancel">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'confirm-swap-model',
  props: ['action'],
  methods: {
    confirm() {
      if(this.action === 'approve')
        this.$emit('confirm-accept');
      else
        this.$emit('confirm-reject')
    },
    cancel() {
      this.$emit('cancel');
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
