<script setup>
	import { onMounted } from "vue";
	import { useStore } from "vuex"; // 1. Importar useStore

	const store = useStore(); // 2. Obter a store

	onMounted(() => {
		// 3. Descomentar a linha e usar 'store' em vez de 'this.$store'
		store.dispatch('startSession');
	});
</script>

<template>
	<main class="fs-6">
		<router-view></router-view>
	</main>
</template>

<style>
	.sce-form {
		width: 100%;
		max-width: 600px;
		padding: 0px;
		margin: auto;
		margin-top: 40px;
	}

	.sce-form-single {
		margin-bottom: -1px;
	}

	.sce-form-top {
		margin-bottom: -1px;
		border-bottom-right-radius: 0;
		border-bottom-left-radius: 0;
	}

	.sce-form-middle {
		margin-bottom: -1px;
		border-radius: 0;
	}

	.sce-form-bottom {
		margin-bottom: -1px;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}

	.is-invalid-div {
		border-radius: 5px;
		border-color: red;
		border-style: solid;
		border-width: 1px;
	}
</style>