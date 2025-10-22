<template>
  <div>

    <CoordenadorEstagioNavigation />

    <div class="container">

      <RoundedBox>

        <h3 class="text-center">{{ $t('header.coordenador.estagio.curso') }}</h3>

        <h5 class="text-center mt-5">A ser implementado.</h5>

      </RoundedBox>
    </div>
  </div>
</template>


<script>
import CoordenadorEstagioNavigation from '@/components/coordenador/estagio/CoordenadorEstagioNavigation.vue';
import RoundedBox from '@/components/base/RoundedBox.vue';

export default {
  components: {
    CoordenadorEstagioNavigation,
    RoundedBox,
  },

}
</script>