<script setup>
	import { ref, onMounted } from "vue";
	import AlunoNavigation from "@/components/aluno/AlunoNavigation.vue";
	import RoundedBox from "@/components/base/RoundedBox.vue";
	import Accordion from "@/components/UI/AccordionCore.vue";
	import TheAlert from "@/components/base/TheAlert.vue"; // Adicionado import
	import axios from "@/misc/axios.js";
	import constants from "@/misc/constants.js";

	const completePreferences = ref(true);
	const errorMessage = ref([]);
	
	// 1. ADICIONAMOS O 'tipoId' A CADA ITEM
	// Esses IDs vêm do seu backend (ModeloDocumentoController.js)
	const documentosAcordeao = [
		{ 
			title: "Carta de Apresentação de Estágio", 
			content: "Envie aqui sua carta de apresentação.",
			tipoId: 1 // ID do modelo no banco
		},
		{
			title: "Confirmação de Orientação de Estágio",
			content: "Envie aqui sua confirmação de orientação.",
			tipoId: 2 // ID do modelo no banco
		},
		{ 
			title: "Ficha de confirmação de estágio", 
			content: "Envie aqui sua ficha de confirmação.",
			tipoId: 3 // ID do modelo no banco
		},
		{ 
			title: "Plano de Atividades", 
			content: "Envie aqui seu plano de atividades.",
			tipoId: 4 // ID do modelo no banco
		},
		{ 
			title: "Autorização de Uso de Imagens", 
			content: "Envie aqui sua autorização de uso de imagens.",
			tipoId: 5 // ID do modelo no banco
		},
	];

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
				<h3 class="text-center">{{ $t("header.aluno.documentos") }}</h3>

				<h5 class="text-center mt-5">
					<span v-if="completePreferences">
						<Accordion :items="documentosAcordeao" />
					</span>
					<span v-else>Incomplete</span>
				</h5>
				<TheAlert :messages="errorMessage"></TheAlert>
			</RoundedBox>
		</div>
	</div>
</template>