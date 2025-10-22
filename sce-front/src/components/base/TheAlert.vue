<template>
    <div v-if="messages && messages.length > 0" class="mt-3">
        <div class="text-danger" v-for="message in messages" :key="message">{{ message }}</div>
    </div>
</template>

<script>
export default {
    props: {
        messages: Array,
    },
}
</script>

<style scoped>
li {
    font-size: 14px;
}
</style>