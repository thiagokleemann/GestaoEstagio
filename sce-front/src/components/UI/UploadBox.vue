<script setup>
	import { ref, defineEmits, defineProps } from "vue"; // <-- 1. Adicionar defineProps
	import axios from "axios";

	// 2. Definir a 'tipo' como uma propriedade obrigatória
	const props = defineProps({
		tipo: {
			type: Number,
			required: true,
		},
	});

	// 3. Remover o 'type' fixo
	// const type = ref(2); // <-- Linha removida
	const isLoading = ref(false);

	const file = ref(null);
	const emit = defineEmits(["changed"]);

	function handleFileSelect(e) {
		const input = e.target;
		const selectedFile = input?.files[0];
		if (selectedFile) {
			file.value = selectedFile;
			emit("changed", file.value);
		}
	}

	function removeFile() {
		file.value = null;
		emit("changed", null);
	}

	async function handleUpload() {
		if (!file.value) {
			alert("Por favor, selecione um arquivo.");
			return;
		}

		const formData = new FormData();

		formData.append("documento", file.value);
		// 4. Usar o 'props.tipo' em vez do 'type.value'
		formData.append("tipo", props.tipo);

		isLoading.value = true;

		try {
			const response = await axios.post("/aluno/documento", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			console.log("Arquivo enviado com sucesso:", response.data);
			alert("Arquivo enviado com sucesso! Recarregue a página para ver o status.");
			file.value = null; 
			emit("changed", null);
		} catch (error) {
			console.error("Erro ao enviar o arquivo:", error);
			alert("Ocorreu um erro ao enviar o arquivo. Tente novamente.");
		} finally {
			isLoading.value = false;
		}
	}
</script>

<template>
	<div>
		<label
			for="file-input"
			class="btn btn-primary"
			>Adicionar Envio</label
		>
		<input
			id="file-input"
			type="file"
			@change="handleFileSelect"
			hidden
			ref="fileInput"
		/>

		<div
			v-if="file"
			class="file-info"
		>
			<span>{{ file.name }}</span>
			<button
				@click="removeFile"
				:disabled="isLoading"
				title="Remover"
			>
				&times;
			</button>
		</div>
		<p v-else>Nenhum arquivo selecionado.</p>

		<button
			v-if="file"
			@click="handleUpload"
			class="btn btn-success"
			:disabled="isLoading"
		>
			{{ isLoading ? "Enviando..." : "Enviar Arquivo" }}
		</button>
	</div>
</template>

<style scoped>
	/* Estilos podem ser mantidos ou ajustados */
	.btn {
		padding: 8px 12px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		margin-right: 10px;
	}
	.btn-primary {
		background-color: #007bff;
		color: white;
	}
	.btn-success {
		background-color: #28a745;
		color: white;
		margin-top: 10px;
	}
	.file-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
		margin-top: 15px;
	}
	.file-info button {
		background: none;
		border: none;
		font-size: 1.2rem;
		color: red;
		font-weight: bold;
		cursor: pointer;
	}
</style>