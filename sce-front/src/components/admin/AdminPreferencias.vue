<template>
  <div>

    <AdminNavigation/>

    <div class="container">

      <RoundedBox>

  <h3 class="text-center">{{ $t('header.admin.preferencias') }}</h3>
      </RoundedBox>
    </div>
  </div>
</template>


<script>
import AdminNavigation from '@/components/admin/AdminNavigation.vue';
import RoundedBox from '@/components/base/RoundedBox.vue';

export default {
  components: {
    AdminNavigation,
    RoundedBox,
  },
}
</script>