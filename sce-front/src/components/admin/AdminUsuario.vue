<template>
  <div>
    <AdminNavigation />

    <div class="container">

      <RoundedBox>

        <h3 class="text-center">{{ $t('header.admin.usuario') }}</h3>

        <div class="sce-form">
          <form @submit.prevent="">

            <div :class="{
          'z-1': !activeTipo && validTipo,
          'z-2': !activeTipo && !validTipo,
          'z-3': activeTipo,
        }" class="form-floating">
              <select v-model.trim="tipo" class="form-select sce-form-top" @focus="activeTipo = true"
                @blur="activeTipo = false" :class="{ 'is-invalid': !validTipo }" id="tipoUsuario" name="tipoUsuario"
                @change="showUsuarios">
                <option value="0">{{ $t('label.todos') }}</option>
                <option v-for="t in tipos" :key="t.id" :value="t.id">{{ t.descricao }}</option>
              </select>
              <label for="tipoUsuario">{{ $t('label.tipo') }}</label>
            </div>

            <div :class="{
          'z-1': !activeCampus && validCampus,
          'z-2': !activeCampus && !validCampus,
          'z-3': activeCampus,
        }" class="form-floating">
              <select v-model.trim="campus" class="form-select sce-form-bottom" @focus="activeCampus = true"
                @blur="activeCampus = false" :class="{ 'is-invalid': !validCampus }" id="deleteCampus"
                name="deleteCampus" @change="showUsuarios">
                <option value="0">{{ $t('label.todos') }}</option>
                <option v-for="c in campi" :key="c.id" :value="c.id">{{ c.descricao }}</option>
              </select>
              <label for="deleteCampus">{{ $t('label.campus') }}</label>
            </div>

            <TheAlert :messages="errorMessages"></TheAlert>

          </form>
        </div>

        <div v-if="errorMessages.length == 0 && (isShowing || isDeleting)" class="d-flex justify-content-center mt-5">
          <div class="spinner-border" role="status">
            <span class="sr-only"></span>
          </div>
        </div>

        <p v-if="errorMessages.length == 0 && !isShowing && !isDeleting && usuarios.length == 0" class="text-center mt-5">
          {{ $t('message.admin.sem-usuarios') }}
        </p>

        <table class="table table-sm table-hover mt-5"
          v-if="errorMessages.length == 0 && !isShowing && !isDeleting && usuarios.length > 0">

          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">{{ $t('label.nome') }}</th>
              <th scope="col">{{ $t('label.email') }}</th>
              <th scope="col">{{ $t('label.campus') }}</th>
              <th scope="col">{{ $t('label.tipo') }}</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in usuarios" :key="u.id">
              <th scope="row">{{ u.id }}</th>
              <td>{{ u.nome }}</td>
              <td>{{ u.email }}</td>
              <td>{{ getDescricaoCampus(u.campus) }}</td>
              <td>{{ getDescricaoTipoUsuario(u.tipo) }}</td>

              <td>
                  <i class="bi bi-trash" @click="showDeleteModal(
                      u.id,
                      u.nome,
                      u.email,
                      getDescricaoCampus(u.campus))">
                  </i>
              </td>
            </tr>
          </tbody>
        </table>
      </RoundedBox>

      <!-- Modal para deletar um Usuário -->
      <Teleport to="body">
        <DeleteModal operation="delete" :show="deleteModal" :id="deleteId" @close="hideDeleteModal"
          @delete="deleteUsuario">
          <template #body>
            <p class="text-center fw-bold">{{ $t('message.admin.delete-usuario') }}</p>
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
import axios from "@/misc/axios.js";

export default {
  components: {
    AdminNavigation,
    RoundedBox,
    TheAlert,
    DeleteModal,
  },

  data() {
    return {
      // v-model dos campos do formulário
      tipo: 0,
      campus: 0,

      // Flags de validação
      validTipo: true,
      validCampus: true,

      // Flags de campos ativos para setar o z-index
      activeTipo: false,
      activeCampus: false,

      // Tipos de usuário e Campi do SELECT do formulário
      tipos: [],
      campi: [],

      // Dados da tabela
      usuarios: [],

      // Usados para exibir o spinner
      isShowing: false,
      isDeleting: false,

      // Arrays de erros
      errorMessages: [],

      // Dados para deletar um Usuario
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
        this.errorMessages = [];
        let response = null;

        response = await axios.get("/campi/index");

        if (response.data)
          this.campi = response.data;

      } catch (error) {
        this.handleError(error);
      }
    },

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

    getDescricaoCampus(id) {
      let campiList = this.campi;
      let campus = campiList.find(c => c.id == id);
      return campus ? campus.descricao : '';
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
        const campus = Number(this.campus);

        const payload = {
          campus,
          tipo,
        };

        response = await axios.get("/admin/usuarios", {
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

    async deleteUsuario(id) {
      this.hideDeleteModal();
      this.isDeleting = true;

      try {
        this.errorMessageTable = [];
        let response = null;

        response = await axios.delete(`/admin/usuario/${id}`);

        if (response.status === 200)
          this.showUsuarios();

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
        this.errorMessages.push(error.response.data.error);
      else
        this.errorMessages.push(error.message);
    },
  },

  mounted() {
    this.loadCampi();
    this.loadTipos();
    this.showUsuarios();
  },

}
</script>