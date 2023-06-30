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
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-background {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fff;
  width: 100%;
  max-width: 400px;
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
