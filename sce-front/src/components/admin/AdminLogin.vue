<script setup>
	import { ref, computed } from "vue";
	import { useStore } from "vuex";
	import { useRouter } from "vue-router";
	//import { useI18n } from 'vue-i18n';
	import TheLogo from "@/components/base/TheLogo.vue";
	import RoundedBox from "@/components/base/RoundedBox.vue";
	import TheAlert from "@/components/base/TheAlert.vue";
	import { validateEmail } from "@/misc/validation.js";
	import constants from "@/misc/constants.js";

	
	const store = useStore();
	const router = useRouter();
	//const { t } = useI18n();

	// Dados para login
	// v-model dos campos do formulário
	const email = ref("");
	const password = ref("");

	// Flags de validação
	const validEmail = ref(true);
	const validPassword = ref(true);

	// Flags de campos ativos para setar o z-index
	const activeEmail = ref(false);
	const activePassword = ref(false);

	// Arrays de erros
	const errorMessages = ref([]);

	// Usados para exibir o spinner
	const isLoading = ref(false);

	const isAdmin = computed(() => store.getters.isAdmin);

	const handleError = (error) => {
		const message = error.response?.data?.error || error.message;
		errorMessages.value.push(message);
	};

	const login = async () => {
		errorMessages.value = [];
		validEmail.value = true;
		validPassword.value = true;

		if (!email.value || !validateEmail(email.value)) {
			validEmail.value = false;
			// Adaptado para não usar i18n diretamente aqui, ou use 't' se o tiver configurado
			errorMessages.value.push("Formato de e-mail inválido."); // Exemplo
		}
		if (
			!password.value ||
			password.value.length < constants.MIN_LENGTH_PASSWD
		) {
			validPassword.value = false;
			errorMessages.value.push(`A senha deve ter pelo menos ${constants.MIN_LENGTH_PASSWD} caracteres.`); // Exemplo
		}

		if (errorMessages.value.length > 0) return;

		const payload = {
			email: email.value,
			password: password.value,
		};

		try {
			isLoading.value = true;
			// 1. Backend define o cookie
			await store.dispatch("loginAdmin", payload);

			// -- A linha 'await store.dispatch("startSession");' NÃO existe nesta versão --

			// 2. Tenta redirecionar ANTES de preencher o Vuex
			if (isAdmin.value) {
				router.replace("/admin/coordenador/estagio");
			} else {
				errorMessages.value.push("Utilizador não é administrador."); // Exemplo
			}
		} catch (error) {
			handleError(error);
		} finally {
			isLoading.value = false;
		}
	};
</script>

<template>
	<div class="sce-form vertical-align">
		<RoundedBox>
			<TheLogo />

			<form @submit.prevent="login">
				<div
					:class="{
						'z-1': !activeEmail && validEmail,
						'z-2': !activeEmail && !validEmail,
						'z-3': activeEmail,
					}"
					class="form-floating"
				>
					<input
						@focus="activeEmail = true"
						@blur="activeEmail = false"
						:class="{ 'is-invalid': !validEmail }"
						type="email"
						class="form-control sce-form-top"
						id="loginEmail"
						name="loginEmail"
						placeholder="Email"
						v-model.trim="email"
					/>
					<label for="loginEmail">{{ $t("label.email") }}</label>
				</div>

				<div
					:class="{
						'z-1': !activePassword && validPassword,
						'z-2': !activePassword && !validPassword,
						'z-3': activePassword,
					}"
					class="form-floating"
				>
					<input
						@focus="activePassword = true"
						@blur="activePassword = false"
						:class="{ 'is-invalid': !validPassword }"
						type="password"
						class="form-control sce-form-bottom"
						id="loginPassword"
						name="loginPassword"
						placeholder="Password"
						v-model.trim="password"
					/>
					<label for="loginPassword">{{
						$t("label.password")
					}}</label>
				</div>

				<button
					class="w-100 mt-3 btn btn-outline-success opacity-75"
					type="submit"
				>
					{{ $t("button.login") }}
				</button>

				<TheAlert :messages="errorMessages"></TheAlert>
			</form>
		</RoundedBox>
		<div
			v-if="isLoading"
			class="d-flex justify-content-center"
		>
			<span class="loader"></span>
		</div>
	</div>
</template>

<style scoped>
	/* Seus estilos originais */
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

	.loader {
		width: 96%;
		height: 7px;
		display: inline-block;
		position: relative;
		background: transparent;
		overflow: hidden;
	}
	.loader::after {
		content: "";
		width: 96px;
		height: 7px;
		background: #0d12a9;
		position: absolute;
		top: 0;
		left: 0;
		box-sizing: border-box;
		animation: animloader 1s linear infinite;
	}

	@keyframes animloader {
		0% {
			left: 0;
			transform: translateX(-100%);
		}
		100% {
			left: 100%;
			transform: translateX(0%);
		}
	}
</style>
