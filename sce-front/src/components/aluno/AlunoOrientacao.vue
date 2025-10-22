<script setup>
	import { ref, onMounted } from "vue";
	import AlunoNavigation from "@/components/aluno/AlunoNavigation.vue";
	import RoundedBox from "@/components/base/RoundedBox.vue";
	import axios from "@/misc/axios.js";
	import constants from "@/misc/constants.js";

	const completePreferences = ref(true);
	const errorMessage = ref([]);

	const handleError = (error) => {
		if (
			error.response &&
			error.response.data &&
			error.response.data.error
		) {
			errorMessage.value.push(error.response.data.error);
		} else {
			errorMessage.value.push(error.message);
		}
	};

	const checkPreferences = async () => {
		try {
			const response = await axios.get("/aluno/preferencias");

			if (response && response.data) {
				const { nome, email, campus, curso } = response.data;

				if (
					nome &&
					nome.length > constants.MIN_LENGTH_NOME &&
					email &&
					campus &&
					curso
				) {
					completePreferences.value = true;
					console.log("true");
				} else {
					completePreferences.value = false;
					console.log("false");
				}
			}
		} catch (error) {
			handleError(error);
		}
	};

	onMounted(() => {
		checkPreferences();
	});
</script>

<template>
	<div>
		<AlunoNavigation />

		<div class="container">
			<RoundedBox>
				<h3 class="text-center">{{ $t("header.aluno.orientacao") }}</h3>

				<h5 class="text-center mt-5">
					<span v-if="completePreferences">Complete</span>
					<span v-else>Incomplete</span>
				</h5>
				<TheAlert :messages="errorMessage"></TheAlert>
			</RoundedBox>
		</div>
	</div>
</template>
