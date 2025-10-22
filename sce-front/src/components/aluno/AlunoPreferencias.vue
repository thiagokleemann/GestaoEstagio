<script setup>
	import { ref, onMounted } from "vue";
	import AlunoNavigation from "@/components/aluno/AlunoNavigation.vue";
	import RoundedBox from "@/components/base/RoundedBox.vue";
	import TheAlert from "@/components/base/TheAlert.vue";
	import axios from "@/misc/axios.js";
	import constants from "@/misc/constants.js";

	// Dados para atualização de preferencias
	// v-model dos campos do formulário

	const nome = ref("");
	const email = ref("");
	const campus = ref("");
	const curso = ref("");

	//Flags de validação

	const validNome = ref(true);
	const validEmail = ref(true);
	const validCampus = ref(true);
	const validCurso = ref(true);

	//Flags de campos ativos para setar o z-index

	const activeNome = ref(false);
	const activeEmail = ref(false);
	const activeCampus = ref(false);
	const activeCurso = ref(false);

	// Dados obtidos do BD

	const cursos = ref([]);

	// Flag do request / usado para exibir o Spinner

	const isLoading = ref(true);
	const isUpdating = ref(false);

	// Arrays de erros / usado no Alert

	const errorMessage = ref([]);

	const loadPreferencias = async () => {
		try {
			isLoading.value = true;
			errorMessage.value = [];
			const response = await axios.get("/aluno/preferencias");

			if (response?.data) {
				nome.value = response.data.nome;
				email.value = response.data.email;
				campus.value = response.data.campus;
				curso.value = response.data.curso;
				await loadCursos();
			}
			checkPreferences();
		} catch (error) {
			handleError(error);
		}
	};

	const loadCursos = async () => {
		try {
			isLoading.value = true;
			errorMessage.value = [];
			const params = { campus: campus.value.id };
			const response = await axios.get("/cursos", { params });
			if (response?.data) {
				cursos.value = response.data;
			}
		} catch (error) {
			handleError(error);
		} finally {
			isLoading.value = false;
		}
	};

	const setCurso = () => {
		if (curso.value) {
			validCurso.value = true;
			errorMessage.value = [];
		}
	};

	const updateAluno = async () => {
		if (checkPreferences()) {
			try {
				isUpdating.value = true;
				const response = await axios.put("/aluno/preferencias", {
					nome: nome.value,
					curso: curso.value,
				});
				if (response.status === 200) {
					await loadPreferencias();
				}
			} catch (error) {
				handleError(error);
			} finally {
				isUpdating.value = false;
			}
		}
	};

	// ARRUMAR COM I18N
	const checkPreferences = () => {
		validNome.value = true;
		validEmail.value = true;
		validCampus.value = true;
		validCurso.value = true;
		errorMessage.value = [];

		if (!nome.value || nome.value.length < constants.MIN_LENGTH_NOME) {
			validNome.value = false;
			errorMessage.value.push(this.$t("error.nome-caracteres"));
		}
		if (!email.value) {
			validEmail.value = false;
			errorMessage.value.push(this.$t("error.email-formato"));
		}
		if (!campus.value) {
			validCampus.value = false;
			errorMessage.value.push(this.$t("error.campus-selecionado"));
		}
		if (!curso.value) {
			validCurso.value = false;
			errorMessage.value.push(this.$t("error.curso-selecionado"));
		}
		return (
			validNome.value &&
			validEmail.value &&
			validCampus.value &&
			validCurso.value
		);
	};

	function handleError(error) {
		if (error.response?.data?.error) {
			errorMessage.value.push(error.response.data.error);
		} else {
			errorMessage.value.push(error.message);
		}
	}

	onMounted(() => {
		loadPreferencias();
	});
</script>

<template>
	<div>
		<AlunoNavigation />

		<div class="container">
			<RoundedBox>
				<h3 class="text-center">
					{{ $t("header.aluno.preferencias") }}
				</h3>

				<div class="sce-form">
					<form @submit.prevent="">
						<div
							:class="{
								'z-1': !activeNome && validNome,
								'z-2': !activeNome && !validNome,
								'z-3': activeNome,
							}"
							class="form-floating"
						>
							<input
								type="text"
								class="form-control sce-form-top"
								@focus="activeNome = true"
								@blur="(activeNome = false), checkPreferences()"
								:class="{ 'is-invalid': !validNome }"
								id="alunoNome"
								name="alunoNome"
								placeholder="Nome"
								v-model.trim="nome"
								autocomplete="off"
							/>
							<label for="alunoNome">{{
								$t("label.nome")
							}}</label>
						</div>

						<div
							:class="{
								'z-1': !activeEmail && validEmail,
								'z-2': !activeEmail && !validEmail,
								'z-3': activeEmail,
							}"
							class="form-floating"
						>
							<input
								type="email"
								class="form-control sce-form-middle"
								@focus="activeEmail = true"
								@blur="
									(activeEmail = false), checkPreferences()
								"
								:class="{ 'is-invalid': !validEmail }"
								id="alunoEmail"
								name="alunoEmail"
								placeholder="Email"
								v-model.trim="email"
								autocomplete="off"
								readonly="readlonly"
								disabled="disabled"
							/>
							<label for="alunoEmail">{{
								$t("label.email")
							}}</label>
						</div>

						<div
							:class="{
								'z-1': !activeCampus && validCampus,
								'z-2': !activeCampus && !validCampus,
								'z-3': activeCampus,
							}"
							class="form-floating"
						>
							<input
								type="text"
								class="form-control sce-form-middle"
								@focus="activeCampus = true"
								@blur="
									(activeCampus = false), checkPreferences()
								"
								:class="{ 'is-invalid': !validCampus }"
								id="alunoCampus"
								name="alunoCampus"
								placeholder="Campus"
								v-model.trim="campus.descricao"
								autocomplete="off"
								readonly="readlonly"
								disabled="disabled"
							/>

							<label for="alunoCampus">{{
								$t("label.campus")
							}}</label>
						</div>

						<div
							:class="{
								'z-1': !activeCurso && validCurso,
								'z-2': !activeCurso && !validCurso,
								'z-3': activeCurso,
							}"
							class="form-floating"
						>
							<select
								v-model.trim="curso"
								class="form-select sce-form-bottom"
								@focus="activeCurso = true"
								@blur="
									(activeCurso = false), checkPreferences()
								"
								:class="{ 'is-invalid': !validCurso }"
								id="alunoCurso"
								name="alunoCurso"
								@change="setCurso"
							>
								<option
									v-for="c in cursos"
									:key="c.id"
									:value="c.id"
									:selected="c.id == curso"
								>
									{{ c.descricao }}
								</option>
							</select>
							<label for="alunoCurso">{{
								$t("label.curso")
							}}</label>
						</div>

						<div class="text-center">
							<button
								class="w-25 mt-3 btn btn-outline-success opacity-75"
								type="submit"
								@click="updateAluno"
								:disabled="
									!nome || !curso || isUpdating || isLoading
								"
							>
								<span
									v-if="isUpdating"
									class="spinner-border spinner-border-sm"
									role="status"
									aria-hidden="true"
								></span>
								{{ $t("button.update") }}
							</button>
						</div>

						<TheAlert :messages="errorMessage"></TheAlert>
					</form>
				</div>
			</RoundedBox>
		</div>
	</div>
</template>
