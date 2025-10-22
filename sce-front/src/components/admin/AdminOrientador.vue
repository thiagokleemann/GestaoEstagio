<template>
  <div>
    <AdminNavigation />

    <div class="container">

      <RoundedBox>

        <h3 class="text-center">{{ $t('header.admin.orientador') }}</h3>

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
              <input type="email" class="form-control sce-form-middle" @focus="activeEmail = true"
                @blur="activeEmail = false" :class="{ 'is-invalid': !validEmail }" id="orientadorEmail"
                name="orientadorEmail" placeholder="Email" v-model.trim="email" autocomplete="off">
              <label for="orientadorEmail">{{ $t('label.email') }}</label>
            </div>

            <div :class="{
          'z-1': !activeCampus && validCampus,
          'z-2': !activeCampus && !validCampus,
          'z-3': activeCampus,
        }" class="form-floating">
              <select v-model.trim="campus" class="form-select sce-form-bottom" @focus="activeCampus = true"
                @blur="activeCampus = false" :class="{ 'is-invalid': !validCampus }" id="orientadorCampus"
                name="orientadorCampus">
                <option v-for="c in campi" :key="c.id" :value="c.id">{{ c.descricao }}</option>
              </select>
              <label for="orientadorCampus">{{ $t('label.campus') }}</label>
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

        <div v-if="errorMessageTable.length == 0 && (isShowing || isDeleting)" class="d-flex justify-content-center mt-5">
          <div class="spinner-border" role="status">
            <span class="sr-only"></span>
          </div>
        </div>

        <p v-if="errorMessageTable.length == 0 && !isShowing && !isDeleting && orientadores.length == 0" class="text-center mt-5">
          {{ $t('message.admin.sem-orientadores') }}
        </p>

        <table class="table table-sm table-hover mt-5"
          v-if="errorMessageTable.length == 0 && !isShowing && !isDeleting && orientadores.length > 0">

          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">{{ $t('label.nome') }}</th>
              <th scope="col">{{ $t('label.email') }}</th>
              <th scope="col">{{ $t('label.campus') }}</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="orientador in orientadores" :key="orientador.id">
              <th scope="row">{{ orientador.id }}</th>
              <td>{{ orientador.nome }}</td>
              <td>{{ orientador.email }}</td>
              <td>{{ getDescricaoCampus(orientador.campus) }}</td>
              <td><i class="bi bi-trash" @click="showDeleteModal(
          orientador.id,
          orientador.nome,
          orientador.email,
          getDescricaoCampus(orientador.campus))">
                </i></td>
            </tr>
          </tbody>
        </table>
      </RoundedBox>

      <!-- Modal para deletar -->
      <Teleport to="body">
        <DeleteModal operation="delete" :show="deleteModal" :id="deleteId"
          @close="hideDeleteModal" @delete="deleteOrientador">
          <template #body>
            <p class="text-center fw-bold">{{ $t('message.admin.delete-orientador') }}</p>
            <p class="text-center text-danger">
              {{ deleteNome }}<br>
              <span class="fst-italic">{{ deleteEmail }}</span><br>
              {{ $t('label.campus') }} {{ deleteCampus }}
            </p>
          </template>
        </DeleteModal>
      </Teleport>
    </div>
  </div>
</template>


<script>
import AdminNavigation from '@/components/admin/AdminNavigation.vue';
import RoundedBox from '@/components/base/RoundedBox.vue';
import TheAlert from '@/components/base/TheAlert.vue';
import DeleteModal from '@/components/base/DeleteModal.vue';
import { validateEmail } from '@/misc/validation.js';
import axios from "@/misc/axios.js";
import constants from "@/misc/constants.js";

export default {
  components: {
    AdminNavigation,
    RoundedBox,
    TheAlert,
    DeleteModal,
  },

  data() {
    return {
      // Dados para cadastro
      // v-model dos campos do formulário
      nome: '',
      email: '',
      campus: '',

      // Flags de validação
      validNome: true,
      validEmail: true,
      validCampus: true,

      // Flags de campos ativos para setar o z-index
      activeNome: false,
      activeEmail: false,
      activeCampus: false,

      // Campi do SELECT do formulário
      campi: [],

      // Dados da tabela de orientadores
      orientadores: [],

      // Flags dos requests
      // Usados para exibir o spinner
      isStoring: false,
      isShowing: false,
      isDeleting: false,

      // Arrays de erros
      errorMessageForm: [],
      errorMessageTable: [],

      // Dados para deletar
      deleteModal: false,
      deleteId: 0,
      deleteNome: '',
      deleteEmail: '',
      deleteCampus: '',

    }
  },

  methods: {

    async loadCampi() {
      try {
        this.campi = [];
        this.errorMessageForm = [];
        let response = null;

        response = await axios.get("/campi/index");

        if (response.data)
          this.campi = response.data;

      } catch (error) {
        this.handleError(error);
      }
    },

    getDescricaoCampus(id) {
      let campiList = this.campi;
      let campus = campiList.find(c => c.id == id);
      return campus ? campus.descricao : '';
    },

    async storeOrientador() {

      this.errorMessageForm = [];
      this.validNome = true;
      this.validEmail = true;
      this.validCampus = true;

      if (!this.nome || this.nome.length < constants.MIN_LENGTH_NOME) {
        this.validNome = false;
        this.errorMessageForm.push(this.$t('error.nome-caracteres'));
      }

      if (!this.email || !validateEmail(this.email)) {
        this.validEmail = false;
        this.errorMessageForm.push(this.$t('error.email-formato'));
      }

      if (!this.campus) {
        this.validCampus = false;
        this.errorMessageForm.push(this.$t('error.campus-selecionado'));
      }

      if (this.errorMessageForm.length > 0)
        return;

      const campus = Number(this.campus);

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

        response = await axios.post("/admin/orientador", payload);

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

        response = await axios.get("/admin/orientador");

        if (response.data)
          this.orientadores = response.data;

      } catch (error) {
        this.handleError(error);
      } finally {
        this.isShowing = false;
      }
    },

    async deleteOrientador(id) {      
      this.hideDeleteModal();
      this.isDeleting = true;

      try {
        this.errorMessageTable = [];
        let response = null;

        response = await axios.delete(`/admin/usuario/${id}`);

        if (response.status === 200)
          this.showOrientadores();

      } catch (error) {
        this.handleError(error);
      } finally {
        this.isDeleting = false;
      }
    },

    showDeleteModal(id, nome, email, campus) {
      this.deleteId = id;
      this.deleteNome = nome;
      this.deleteEmail = email;
      this.deleteCampus = campus;
      this.deleteModal = true;
    },

    hideDeleteModal() {
      this.deleteId = 0;
      this.deleteNome = '';
      this.deleteEmail = '';
      this.deleteCampus = '';
      this.deleteModal = false;
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
      this.campus = '';
    },
  },

  mounted() {
    this.loadCampi();
    this.showOrientadores();
  },

}
</script>