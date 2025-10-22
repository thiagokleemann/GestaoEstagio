<template>
  <div>

    <OrientadorNavigation />

    <div class="container">

      <RoundedBox>

        <h3 class="text-center">{{ $t('header.orientador.preferencias') }}</h3>

        <div class="sce-form">
          <form @submit.prevent="">


            <div :class="{
              'z-1': !activeNome && validNome,
              'z-2': !activeNome && !validNome,
              'z-3': activeNome, }" class="form-floating">

                      <input type="text" class="form-control sce-form-top" @focus="activeNome = true" 
                        @blur="activeNome = false, checkPreferences()"
                        :class="{ 'is-invalid': !validNome }" id="orientadorNome" name="orientadorNome"
                        placeholder="Nome" v-model.trim="nome" autocomplete="off">
                      <label for="orientadorNome">Nome</label>
            </div>

            <div :class="{
              'z-1': !activeEmail && validEmail,
              'z-2': !activeEmail && !validEmail,
              'z-3': activeEmail, }" class="form-floating">

                  <input type="email" class="form-control sce-form-middle" @focus="activeEmail = true"
                    @blur="activeEmail = false, checkPreferences()"
                    :class="{ 'is-invalid': !validEmail }" id="orientadorEmail"
                    name="orientadorEmail" placeholder="Email" v-model.trim="email" autocomplete="off"
                    readonly="readlonly" disabled="disabled">
                  <label for="orientadorEmail">Email</label>
            </div>


            <div :class="{
                  'z-1': !activeCampus && validCampus,
                  'z-2': !activeCampus && !validCampus,
                  'z-3': activeCampus, }" class="form-floating">

                  <input type="text" class="form-control sce-form-bottom" @focus="activeCampus = true"
                    @blur="activeCampus = false, checkPreferences()"
                    :class="{ 'is-invalid': !validCampus }" id="orientadorCampus"
                    name="orientadorCampus" placeholder="Campus" v-model.trim="campus.descricao" autocomplete="off" 
                    readonly="readlonly" disabled="disabled">
                  
                    <label for="orientadorCampus">Campus</label>
            </div>

            <div class="my-4" :class="{ 'is-invalid-div': !validCursos }">

              <div class="mx-4 mt-2">Cursos</div>
              
              <div class="mx-4 my-2 form-check" v-for="c in cursosCampus" :key="c.id" >
                <input class="form-check-input" type="checkbox" 
                  :value="c.id" :id="c.id" :checked="cursos.includes(c.id)"
                  @change="setCurso">
                <label class="form-check-label" :for="c.id">
                  {{ c.descricao }} 
                </label>
              </div>

            </div>

            <div class="text-center">
              <button class="w-25 mt-3 btn btn-outline-success opacity-75" type="submit" @click="updateOrientador"
                :disabled="!nome || isUpdating || isLoading">
                <span v-if="isUpdating" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {{ $t('button.update') }}
              </button>
            </div>

            <TheAlert :messages="errorMessage"></TheAlert>

          </form>
        </div>

      </RoundedBox>

      
    </div>
  </div>
</template>


<script>
import OrientadorNavigation from '@/components/orientador/OrientadorNavigation.vue';
import RoundedBox from '@/components/base/RoundedBox.vue';
import TheAlert from '@/components/base/TheAlert.vue';
import axios from "@/misc/axios.js";
import constants from "@/misc/constants.js";


export default {
  components: {
    OrientadorNavigation,
    RoundedBox,
    TheAlert,
  },

  data() {
    return {
      // Dados para atualização de preferencias
      // v-model dos campos do formulário
      nome: '',
      email: '',
      campus: '',
      cursos: [],

      // Flags de validação
      validNome: true,
      validEmail: true,
      validCampus: true,
      validCursos: true,

      // Flags de campos ativos para setar o z-index
      activeNome: false,
      activeEmail: false,
      activeCampus: false,

      // Dados obtidos do BD
      cursosCampus: [],

      // Flag do request / usado para exibir o Spinner
      isLoading: true,
      isUpdating: false,

      // Arrays de erros / usado no Alert
      errorMessage: [],
    }
  },

  methods: {

    async loadPreferencias() {
      try {
        this.isLoading = true;
        this.errorMessage = [];
        let response = await axios.get("/orientador/preferencias");

        if (response && response.data) {
          this.nome = response.data.nome;
          this.email = response.data.email;
          this.campus = response.data.campus;
          this.cursos = response.data.cursos;          
          await this.loadCursos();
        }

        this.checkPreferences();

      } catch (error) {
        this.handleError(error);
      } finally {
        this.isLoading = false;
      }
    },

    async loadCursos() {
      try {
        this.isLoading = true;
        this.errorMessage = [];
        const params = { campus: this.campus.id };        
        let response = await axios.get("/cursos", { params });
        if (response && response.data) this.cursosCampus = response.data;
      } catch (error) {
        this.handleError(error);
      } finally {
        this.isLoading = false;
      }
    },

    setCurso(e) {
      const id = Number(e.target.id);
      if(e.target.checked && !this.cursos.includes(id))
        this.cursos.push(id);
      else if(!e.target.checked && this.cursos.includes(id))
        this.cursos = this.cursos.filter(e => e !== id)        
    },

    async updateOrientador() {
      
      if(this.checkPreferences()) {
        try {
          this.isUpdating = true;
          let response = await axios.put("/orientador/preferencias", { nome: this.nome, cursos: this.cursos });
          if (response.status === 200)  await this.loadPreferencias();
        } catch (error) {
          this.handleError(error);
        } finally {
          this.isUpdating = false;
        }
      }
    },

    checkPreferences() {
      this.validNome = true;
      this.validEmail = true;
      this.validCampus = true;
      this.validCursos = true;

      this.errorMessage = [];

      if(!this.nome || this.nome.length < constants.MIN_LENGTH_NOME) {
        this.validNome = false;
        this.errorMessage.push(this.$t('error.nome-caracteres'));
      }

      if(!this.email) {
        this.validEmail = false;
        this.errorMessage.push(this.$t('error.email-formato'));
      }

      if(!this.campus) {
        this.validCampus = false;
        this.errorMessage.push(this.$t('error.campus-selecionado'));
      }

      if(!this.cursos || this.cursos.length === 0) {
        this.validCursos = false;
        this.errorMessage.push(this.$t('error.cursos-selecionados'));
      }

      return (this.validNome && this.validEmail && this.validCampus && this.validCursos);
    },

    handleError(error) {
      if (error.response && error.response.data && error.response.data.error)
        this.errorMessage.push(error.response.data.error);
      else
        this.errorMessage.push(error.message);
    },

  },

  mounted() {
    this.loadPreferencias();
  }
}
</script>