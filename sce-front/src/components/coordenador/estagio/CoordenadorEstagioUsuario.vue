<template>
  <div>
    <CoordenadorEstagioNavigation />

    <div class="container">

      <RoundedBox>

        <h3 class="text-center">{{ $t('header.coordenador.estagio.usuario') }}</h3>

        <div class="sce-form">
          <form @submit.prevent="">

            <div :class="{
          'z-1': !activeTipo && validTipo,
          'z-2': !activeTipo && !validTipo,
          'z-3': activeTipo,
        }" class="form-floating">
              <select v-model.trim="tipo" class="form-select sce-form-single" @focus="activeTipo = true"
                @blur="activeTipo = false" :class="{ 'is-invalid': !validTipo }" id="tipoUsuario" name="tipoUsuario"
                @change="showUsuarios">
                <option value="0">{{ $t('label.todos') }}</option>
                <option v-for="t in tipos" :key="t.id" :value="t.id">{{ t.descricao }}</option>
              </select>
              <label for="tipoUsuario">{{ $t('label.tipo') }}</label>
            </div>

            <TheAlert :messages="errorMessages"></TheAlert>

          </form>
        </div>

        <div v-if="errorMessages.length == 0 && isShowing" class="d-flex justify-content-center mt-5">
          <div class="spinner-border" role="status">
            <span class="sr-only"></span>
          </div>
        </div>

        <p v-if="errorMessages.length == 0 && !isShowing && usuarios.length == 0" class="text-center mt-5">
          {{ $t('message.admin.sem-usuarios') }}
        </p>

        <table class="table table-sm table-hover mt-5"
          v-if="errorMessages.length == 0 && !isShowing && usuarios.length > 0">

          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">{{ $t('label.nome') }}</th>
              <th scope="col">{{ $t('label.email') }}</th>
              <th scope="col">{{ $t('label.tipo') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in usuarios" :key="u.id">
              <th scope="row">{{ u.id }}</th>
              <td>{{ u.nome }}</td>
              <td>{{ u.email }}</td>
              <td>{{ getDescricaoTipoUsuario(u.tipo) }}</td>
            </tr>
          </tbody>
        </table>
      </RoundedBox>
    </div>
  </div>
</template>


<script>
import CoordenadorEstagioNavigation from '@/components/coordenador/estagio/CoordenadorEstagioNavigation.vue';
import RoundedBox from '@/components/base/RoundedBox.vue';
import TheAlert from '@/components/base/TheAlert.vue';
import axios from "@/misc/axios.js";

export default {
  components: {
    CoordenadorEstagioNavigation,
    RoundedBox,
    TheAlert,
  },

  data() {
    return {
      // v-model dos campos do formulário
      tipo: 0,

      // Flags de validação
      validTipo: true,

      // Flags de campos ativos para setar o z-index
      activeTipo: false,

      // Tipos de usuário e Campi do SELECT do formulário
      tipos: [],

      // Dados da tabela
      usuarios: [],

      // Usados para exibir o spinner
      isShowing: false,

      // Arrays de erros
      errorMessages: [],
    }
  },

  methods: {

    async loadTipos() {
      try {
        this.tipos = [];
        this.errorMessages = [];
        let response = null;

        response = await axios.get("/tipos/index");

        if (response.data)
          this.tipos = response.data;

      } catch (error) {
        this.handleError(error);
      }
    },

    getDescricaoTipoUsuario(id) {
      let tiposList = this.tipos;
      let tipo = tiposList.find(t => t.id == id);
      return tipo ? tipo.descricao : '';
    },

    async showUsuarios() {
      try {
        this.isShowing = true;
        this.usuarios = [];
        this.errorMessages = [];
        let response = null;

        const tipo = Number(this.tipo);
        const campus = Number(this.$store.getters.campus);

        const payload = {
          campus,
          tipo,
        };

        response = await axios.get("/coordenador/estagio/usuarios", {
          params: payload
        });

        if (response.data)
          this.usuarios = response.data;

      } catch (error) {
        this.handleError(error);
      } finally {
        this.isShowing = false;
      }
    },

    handleError(error) {
      if (error.response && error.response.data && error.response.data.error)
        this.errorMessages.push(error.response.data.error);
      else
        this.errorMessages.push(error.message);
    },
  },

  mounted() {
    this.loadTipos();
    this.showUsuarios();
  },

}
</script>