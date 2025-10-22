<template>
  <div class="sce-form vertical-align text-center">
    <RoundedBox>
      <TheLogo />

      <div>
        {{ $t('message.login.fail-p1') }}
        <span class="font-monospace fw-bold">{{ email }}</span> 
        {{ $t('message.login.fail-p2') }}
        <span class="font-monospace fw-bold">{{ $t('message.login.dominio') }}</span>
      </div>

      <div>
        <router-link to="/">
          <button type="button" class="mt-5 btn btn-outline-secondary">{{ $t('button.ok') }}</button>
        </router-link>
      </div>

    </RoundedBox>

  </div>

</template>

<script>
import TheLogo from '@/components/base/TheLogo.vue';
import RoundedBox from '@/components/base/RoundedBox.vue';


export default {

  computed: {
    email() {
      return this.$route.query.email;
    }
  },

  components: {
    TheLogo,
    RoundedBox,
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