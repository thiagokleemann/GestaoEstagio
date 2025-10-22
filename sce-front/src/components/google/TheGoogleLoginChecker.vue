<template>
  <div class="sce-form vertical-align text-center">
    <RoundedBox>
      <TheLogo />
        <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status"></div>
    </RoundedBox>
  </div>
</template>

<script>
import TheLogo from '@/components/base/TheLogo.vue';
import RoundedBox from '@/components/base/RoundedBox.vue';
import constants from '@/misc/constants.js';

export default {
  data() {
    return {
      errorMessages: [],
    }
  },

  methods: {
    async check() {

      this.errorMessages = [];

      try {

        await this.$store.dispatch('startSession');

        switch (Number(this.$store.getters.tipo)) {
          case constants.COORDENADOR_ESTAGIO:
            this.$router.push('/coordenador/estagio/lista/usuario');
            break;
          case constants.COORDENADOR_CURSO:
            this.$router.push('/coordenador/curso/lista/aluno');
            break;
          case constants.ORIENTADOR:
            this.$router.push('/orientador/orientacao');
            break;
          case constants.ALUNO:
            this.$router.push('/aluno/orientacao');
            break;
          default:
            break;
        }





      } catch (error) {
        this.handleError(error);
      }
    },

    handleError(error) {
      if (error.response && error.response.data && error.response.data.error)
        this.errorMessages.push(error.response.data.error);
      else
        this.errorMessages.push(error.message);
    },
  },

  components: {
    TheLogo,
    RoundedBox,
  },

  created: function () {
    this.check();
  },

}
</script>

<style scoped>
html,
body {
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.vertical-align {
  margin-top: 200px;
}
</style>