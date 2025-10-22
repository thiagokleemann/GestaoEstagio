<template>
  <div>
    <div class="container text-center">
      <img class="img-fluid rounded mb-4 mx-3" alt="SCE Logo" src="@/assets/logo.png" width="150">
      <span v-if="message" class="fs-3">{{ message }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: String,
  }
}
</script>