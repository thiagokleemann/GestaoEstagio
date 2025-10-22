<template>
  <div>
    <CoordenadorEstagioNavigation />

    <div class="container">

      <RoundedBox>

        <h3 class="text-center">{{ $t('header.coordenador.estagio.orientador') }}</h3>

        <div class="sce-form">
          <form @submit.prevent="">

            <div :class="{
          'z-1': !activeNome && validNome,
          'z-2': !activeNome && !validNome,
          'z-3': activeNome,
        }" class="form-floating">
              <input type="text" class="form-control sce-form-top" @focus="activeNome = true" @blur="activeNome = false"
                :class="{ 'is-invalid': !validNome }" id="orientadorNome" name="orientadorNome"
                placeholder="Nome" v-model.trim="nome" autocomplete="off">
              <label for="orientadorNome">{{ $t('label.nome') }}</label>
            </div>

            <div :class="{
          'z-1': !activeEmail && validEmail,
          'z-2': !activeEmail && !validEmail,
          'z-3': activeEmail,
        }" class="form-floating">
              <input type="email" class="form-control sce-form-bttom" @focus="activeEmail = true"
                @blur="activeEmail = false" :class="{ 'is-invalid': !validEmail }" id="orientadorEmail"
                name="orientadorEmail" placeholder="Email" v-model.trim="email" autocomplete="off">
              <label for="orientadorEmail">{{ $t('label.email') }}</label>
            </div>

                 <div class="text-center">
              <button class="w-25 mt-3 btn btn-outline-success opacity-75" type="submit" @click="storeOrientador"
                :disabled="isStoring">
                <span v-if="isStoring" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {{ $t('button.store') }}
              </button>
            </div>


            <TheAlert :messages="errorMessageForm"></TheAlert>

          </form>
        </div>

        <TheAlert :messages="errorMessageTable"></TheAlert>

        <div v-if="errorMessageTable.length == 0 && isShowing" class="d-flex justify-content-center mt-5">
          <div class="spinner-border" role="status">
            <span class="sr-only"></span>
          </div>
        </div>

        <p v-if="errorMessageTable.length == 0 && !isShowing  && orientadores.length == 0" class="text-center mt-5">
          {{ $t('message.admin.sem-orientadores') }}
        </p>

        <table class="table table-sm table-hover mt-5"
          v-if="errorMessageTable.length == 0 && !isShowing && orientadores.length > 0">

          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">{{ $t('label.nome') }}</th>
              <th scope="col">{{ $t('label.email') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="orientador in orientadores" :key="orientador.id">
              <th scope="row">{{ orientador.id }}</th>
              <td>{{ orientador.nome }}</td>
              <td>{{ orientador.email }}</td>
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
import { validateEmail } from '@/misc/validation.js';
import axios from "@/misc/axios.js";
import constants from "@/misc/constants.js";

export default {
  components: {
    CoordenadorEstagioNavigation,
    RoundedBox,
    TheAlert,
  },

  data() {
    return {
      // Dados para cadastro
      // v-model dos campos do formulário
      nome: '',
      email: '',

      // Flags de validação
      validNome: true,
      validEmail: true,

      // Flags de campos ativos para setar o z-index
      activeNome: false,
      activeEmail: false,

      // Dados da tabela de orientadores
      orientadores: [],

      // Flags dos requests
      // Usados para exibir o spinner
      isStoring: false,
      isShowing: false,

      // Arrays de erros
      errorMessageForm: [],
      errorMessageTable: [],
    }
  },

  methods: {


    async storeOrientador() {

      this.errorMessageForm = [];
      this.validNome = true;
      this.validEmail = true;

      if (!this.nome || this.nome.length < constants.MIN_LENGTH_NOME) {
        this.validNome = false;
        this.errorMessageForm.push(this.$t('error.nome-caracteres'));
      }

      if (!this.email || !validateEmail(this.email)) {
        this.validEmail = false;
        this.errorMessageForm.push(this.$t('error.email-formato'));
      }

      if (this.errorMessageForm.length > 0)
        return;

      const campus = Number(this.$store.getters.campus);

      // Cadastro somente de orientador de estágios
      // Tipo constante (tipo = 1)
      const payload = {
        nome: this.nome,
        email: this.email,
        campus,
        tipo: constants.ORIENTADOR,
        ativo: true,
      };

      try {
        this.isStoring = true;
        let response = null;

        response = await axios.post("/coordenador/estagio/orientador", payload);

        if (response.data) {
          this.showOrientadores();
          this.resetForm();
        }

      } catch (error) {
        this.handleError(error);
      } finally {
        this.isStoring = false;
      }
    },

    async showOrientadores() {
      try {
        this.isShowing = true;
        this.orientadores = [];
        this.errorMessageTable = [];
        let response = null;

        response = await axios.get("/coordenador/estagio/orientador");

        if (response.data)
          this.orientadores = response.data;

      } catch (error) {
        this.handleError(error);
      } finally {
        this.isShowing = false;
      }
    },

    handleError(error) {
      if (error.response && error.response.data && error.response.data.error)
        this.errorMessageForm.push(error.response.data.error);
      else
        this.errorMessageForm.push(error.message);
    },

    resetForm() {
      this.nome = '';
      this.email = '';
    },
  },

  mounted() {
    this.showOrientadores();
  },

}
</script>