<template>
  <div>

    <OrientadorNavigation />

    <div class="container">

      <RoundedBox>

        <h3 class="text-center">{{ $t('header.orientador.orientacao') }}</h3>

        <h5 class="text-center mt-5">
            <span v-if="completePreferences">Complete</span>
            <span v-else>Incomplete</span>
        </h5>
        
        <TheAlert :messages="errorMessage"></TheAlert>

      </RoundedBox>
    </div>
  </div>
</template>


<script>
import OrientadorNavigation from '@/components/orientador/OrientadorNavigation.vue';
import RoundedBox from '@/components/base/RoundedBox.vue';
import axios from "@/misc/axios.js";
import constants from "@/misc/constants.js";


export default {
  components: {
    OrientadorNavigation,
    RoundedBox,
  },

  data() {
    return {
      completePreferences: true,
      errorMessage: [],
    }
  },

  methods: {

    async checkPreferences() {
      try {
        let response = await axios.get("/orientador/preferencias");

        if (response && response.data) {
          const { nome, email, campus, cursos } = response.data;

          if(nome && nome.length > constants.MIN_LENGTH_NOME &&
              email && campus && 
                cursos && cursos.length > 0 )
                    this.completePreferences = true; 
          else this.completePreferences = false;                   
        }
      } catch (error) {
        this.handleError(error);
      }
    },

    handleError(error) {
      if (error.response && error.response.data && error.response.data.error)
        this.errorMessage.push(error.response.data.error);
      else
        this.errorMessage.push(error.message);
    },

  },

  mounted() {
    this.checkPreferences();
  }

}
</script>