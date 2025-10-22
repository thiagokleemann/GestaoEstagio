<script setup>
	import { ref, onMounted } from "vue";
	//import { useI18n } from 'vue-i18n';
	import AdminNavigation from "@/components/admin/AdminNavigation.vue";
	import RoundedBox from "@/components/base/RoundedBox.vue";
	import TheAlert from "@/components/base/TheAlert.vue";
	import DeleteModal from "@/components/base/DeleteModal.vue";
	import { validateEmail } from "@/misc/validation.js";
	import axios from "@/misc/axios.js";
	import constants from "@/misc/constants.js";

	//const { t } = useI18n();

	// Dados para cadastro
	// v-model dos campos do formulário
	const nome = ref("");
	const email = ref("");
	const campus = ref("");

	// Flags de validação
	const validNome = ref(true);
	const validEmail = ref(true);
	const validCampus = ref(true);

	// Flags de campos ativos para setar o z-index
	const activeNome = ref(false);
	const activeEmail = ref(false);
	const activeCampus = ref(false);

	// Data para selects e table
	const campi = ref([]);
	const coordenadores = ref([]);

	// Flags dos requests
	// Usados para exibir o spinner
	const isStoring = ref(false);
	const isShowing = ref(false);
	const isDeleting = ref(false);

	// Arrays de erros
	const errorMessageForm = ref([]);
	const errorMessageTable = ref([]);

	// Dados para deletar
	const deleteModal = ref(false);
	const deleteId = ref(0);
	const deleteNome = ref("");
	const deleteEmail = ref("");
	const deleteCampus = ref("");

	const handleError = (error) => {
		const message = error.response?.data?.error || error.message;
		errorMessageForm.value.push(message);
	};

	const resetForm = () => {
		nome.value = "";
		email.value = "";
		campus.value = "";
		validNome.value = true;
		validEmail.value = true;
		validCampus.value = true;
		errorMessageForm.value = [];
	};

	const loadCampi = async () => {
		try {
			errorMessageForm.value = [];
			const response = await axios.get("/campi/index");
			campi.value = response.data || [];
		} catch (error) {
			handleError(error);
		}
	};

	const getDescricaoCampus = (id) => {
		const foundCampus = campi.value.find((c) => c.id == id);
		return foundCampus ? foundCampus.descricao : "";
	};

	const showCoordenadores = async () => {
		try {
			isShowing.value = true;
			errorMessageTable.value = [];
			const response = await axios.get("/admin/coordenador/estagio");
			coordenadores.value = response.data || [];
		} catch (error) {
			handleError(error);
		} finally {
			isShowing.value = false;
		}
	};

	const storeCoordenador = async () => {
		errorMessageForm.value = [];
		validNome.value = true;
		validEmail.value = true;
		validCampus.value = true;

		if (!nome.value || nome.value.length < constants.MIN_LENGTH_NOME) {
			validNome.value = false;
			errorMessageForm.value.push(this.$t("error.nome-caracteres"));
		}
		if (!email.value || !validateEmail(email.value)) {
			validEmail.value = false;
			errorMessageForm.value.push(this.$t("error.email-formato"));
		}
		if (!campus.value) {
			validCampus.value = false;
			errorMessageForm.value.push(this.$t("error.campus-selecionado"));
		}

		if (errorMessageForm.value.length > 0) return;

		// Cadastro somente de coordenador de estágios
		// Tipo constante (tipo = 1)
		const payload = {
			nome: nome.value,
			email: email.value,
			campus: Number(campus.value),
			tipo: constants.COORDENADOR_ESTAGIO,
			ativo: true,
		};

		try {
			isStoring.value = true;
			await axios.post("/admin/coordenador/estagio", payload);
			await showCoordenadores();
			resetForm();
		} catch (error) {
			handleError(error);
		} finally {
			isStoring.value = false;
		}
	};

	const showDeleteModal = (id, modalNome, modalEmail, modalCampus) => {
		deleteId.value = id;
		deleteNome.value = modalNome;
		deleteEmail.value = modalEmail;
		deleteCampus.value = modalCampus;
		deleteModal.value = true;
	};

	const hideDeleteModal = () => {
		deleteModal.value = false;
		deleteId.value = 0;
		deleteNome.value = "";
		deleteEmail.value = "";
		deleteCampus.value = "";
	};

	const deleteCoordenador = async (id) => {
		hideDeleteModal();
		try {
			isDeleting.value = true;
			errorMessageTable.value = [];
			await axios.delete(`/admin/usuario/${id}`);
			await showCoordenadores();
		} catch (error) {
			handleError(error);
		} finally {
			isDeleting.value = false;
		}
	};

	onMounted(() => {
		loadCampi();
		showCoordenadores();
	});
</script>

<template>
	<div>
		<AdminNavigation />

		<div class="container">
			<RoundedBox>
				<h3 class="text-center">
					{{ $t("header.admin.coordenador-estagio") }}
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
								@blur="activeNome = false"
								:class="{ 'is-invalid': !validNome }"
								id="coordenadorNome"
								name="coordenadorNome"
								placeholder="Nome"
								v-model.trim="nome"
								autocomplete="off"
							/>
							<label for="coordenadorNome">{{
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
								@blur="activeEmail = false"
								:class="{ 'is-invalid': !validEmail }"
								id="coordenadorEmail"
								name="coordenadorEmail"
								placeholder="Email"
								v-model.trim="email"
								autocomplete="off"
							/>
							<label for="coordenadorEmail">{{
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
							<select
								v-model.trim="campus"
								class="form-select sce-form-bottom"
								@focus="activeCampus = true"
								@blur="activeCampus = false"
								:class="{ 'is-invalid': !validCampus }"
								id="coordenadorCampus"
								name="coordenadorCampus"
							>
								<option
									v-for="c in campi"
									:key="c.id"
									:value="c.id"
								>
									{{ c.descricao }}
								</option>
							</select>
							<label for="coordenadorCampus">{{
								$t("label.campus")
							}}</label>
						</div>

						<div class="text-center">
							<button
								class="w-25 mt-3 btn btn-outline-success opacity-75"
								type="submit"
								@click="storeCoordenador"
								:disabled="isStoring"
							>
								<span
									v-if="isStoring"
									class="spinner-border spinner-border-sm"
									role="status"
									aria-hidden="true"
								></span>
								{{ $t("button.store") }}
							</button>
						</div>

						<TheAlert :messages="errorMessageForm"></TheAlert>
					</form>
				</div>

				<TheAlert :messages="errorMessageTable"></TheAlert>

				<div
					v-if="
						errorMessageTable.length == 0 &&
						(isShowing || isDeleting)
					"
					class="d-flex justify-content-center mt-5"
				>
					<div
						class="spinner-border"
						role="status"
					>
						<span class="sr-only"></span>
					</div>
				</div>

				<p
					v-if="
						errorMessageTable.length == 0 &&
						!isShowing &&
						!isDeleting &&
						coordenadores.length == 0
					"
					class="text-center mt-5"
				>
					{{ $t("message.admin.sem-coordenadores-estagio") }}
				</p>

				<table
					class="table table-sm table-hover mt-5"
					v-if="
						errorMessageTable.length == 0 &&
						!isShowing &&
						!isDeleting &&
						coordenadores.length > 0
					"
				>
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">{{ $t("label.nome") }}</th>
							<th scope="col">{{ $t("label.email") }}</th>
							<th scope="col">{{ $t("label.campus") }}</th>
							<th scope="col"></th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="coordenador in coordenadores"
							:key="coordenador.id"
						>
							<th scope="row">{{ coordenador.id }}</th>
							<td>{{ coordenador.nome }}</td>
							<td>{{ coordenador.email }}</td>
							<td>
								{{ getDescricaoCampus(coordenador.campus) }}
							</td>
							<td>
								<i
									class="bi bi-trash"
									@click="
										showDeleteModal(
											coordenador.id,
											coordenador.nome,
											coordenador.email,
											getDescricaoCampus(
												coordenador.campus
											)
										)
									"
								>
								</i>
							</td>
						</tr>
					</tbody>
				</table>
			</RoundedBox>

			<!-- Modal para deletar -->
			<Teleport to="body">
				<DeleteModal
					operation="delete"
					:show="deleteModal"
					:id="deleteId"
					@close="hideDeleteModal"
					@delete="deleteCoordenador"
				>
					<template #body>
						<p class="text-center fw-bold">
							{{ $t("message.admin.delete-coordenador-estagio") }}
						</p>
						<p class="text-center text-danger">
							{{ deleteNome }}<br />
							<span class="fst-italic">{{ deleteEmail }}</span
							><br />
							{{ $t("label.campus") }} {{ deleteCampus }}
						</p>
					</template>
				</DeleteModal>
			</Teleport>
		</div>
	</div>
</template>
