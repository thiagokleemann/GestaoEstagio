<script setup>
	import { defineProps, defineEmits } from "vue";
	import UploadBox from "./UploadBox.vue";
	import axios from "@/misc/axios.js"; // Importar axios

	const props = defineProps({
		title: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		isOpen: {
			type: Boolean,
			default: false,
		},
		tipoId: {
			type: Number,
			required: true,
		},
	});

	defineEmits(["toggle"]);

	// Função para download via Axios
	const baixarModelo = async () => {
		console.log(`Tentando baixar modelo ID: ${props.tipoId}`); // Log para depuração
		try {
			// Verifica se a baseURL está definida antes de usar
			if (!axios.defaults.baseURL) {
				console.error("Axios baseURL não está definida!");
				alert("Erro de configuração: A URL do backend não está definida.");
				return;
			}
			console.log(`Usando baseURL: ${axios.defaults.baseURL}`); // Log para depuração

			const response = await axios.get(`/download/${props.tipoId}`, {
				responseType: "blob", 
			});

			console.log("Resposta do download recebida:", response.headers); // Log para depuração

			const contentDisposition = response.headers["content-disposition"];
			let filename = `modelo_documento_${props.tipoId}.doc`; 
			if (contentDisposition) {
				const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
				if (filenameMatch && filenameMatch.length === 2) {
					filename = filenameMatch[1];
				}
			}
			console.log(`Nome do arquivo: ${filename}`); // Log para depuração


			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", filename); 
			document.body.appendChild(link);
			link.click();

			link.parentNode.removeChild(link);
			window.URL.revokeObjectURL(url);
			console.log("Download iniciado com sucesso."); // Log para depuração

		} catch (error) {
			console.error("Erro detalhado ao baixar o modelo:", error.response || error.message || error); // Log mais detalhado
			alert("Não foi possível baixar o modelo. Verifique o console (F12) para mais detalhes.");
		}
	};

</script>

<template>
	<div class="accordion-item">
		<div
			class="accordion-header"
			@click="$emit('toggle')"
		>
			{{ title }}
			<span class="toggle-icon">{{ isOpen ? "▲" : "▼" }}</span>
		</div>

		<div
			v-if="isOpen"
			class="accordion-content"
		>
			<div class="mb-3">
				<strong>Modelo:</strong>
				<a href="#" @click.prevent="baixarModelo"> 
					Baixar o modelo do documento
				</a>
				<p class="text-muted small">
					Preencha o modelo, salve como PDF e envie abaixo.
				</p>
			</div>
			
			<hr>

			<p><strong>Envio:</strong></p>
			<UploadBox :multiple="false" />
		</div>
	</div>
</template>

<style scoped>
	/* Seus estilos */
	.accordion-item { border-bottom: 1px solid #eee; }
	.accordion-header { padding: 10px; cursor: pointer; background-color: #f7f7f7; display: flex; justify-content: space-between; align-items: center; font-weight: 500; }
	.accordion-header:hover { background-color: #eee; }
	.toggle-icon { margin-left: 10px; font-size: 0.8em; }
	.accordion-content { padding: 15px 10px; background-color: white; }
</style>