<template>
  <div>

    <CoordenadorCursoNavigation />

    <div class="container">

      <RoundedBox>

        <h3 class="text-center">{{ $t('header.coordenador.curso.aluno') }}</h3>

        <h5 class="text-center mt-5">A ser implementado.</h5>

      </RoundedBox>
    </div>
  </div>
</template>


<script>
import CoordenadorCursoNavigation from '@/components/coordenador/curso/CoordenadorCursoNavigation.vue';
import RoundedBox from '@/components/base/RoundedBox.vue';

export default {
  components: {
    CoordenadorCursoNavigation,
    RoundedBox,
  },
}
</script>