<script setup>
	import { ref, onMounted } from "vue";
	//import { useI18n } from "vue-i18n";
	import AdminNavigation from "@/components/admin/AdminNavigation.vue";
	import RoundedBox from "@/components/base/RoundedBox.vue";
	import TheAlert from "@/components/base/TheAlert.vue";
	import DeleteModal from "@/components/base/DeleteModal.vue";
	import axios from "@/misc/axios.js";
	import constants from "@/misc/constants.js";

	//const { t } = useI18n();

	// Dados para cadastro de novo curso
	// v-model dos campos do formulário
	const descricao = ref("");
	const campus = ref("");
	const obrigatorio = ref(false);
	const naoObrigatorio = ref(false);

	// Flags de validação
	const validDescricao = ref(true);
	const validCampus = ref(true);
	const validEstagio = ref(true);

	// Flags de campos ativos para setar o z-index
	const activeDescricao = ref(false);
	const activeCampus = ref(false);

	// Data para selects e table
	const campi = ref([]);
	const cursos = ref([]);

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
	const deleteDescricao = ref("");
	const deleteCampus = ref("");

	const handleError = (error) => {
		const message = error.response?.data?.error || error.message;
		errorMessageForm.value.push(message);
	};

	const resetForm = () => {
		descricao.value = "";
		campus.value = "";
		obrigatorio.value = false;
		naoObrigatorio.value = false;
		errorMessageForm.value = [];
		validDescricao.value = true;
		validCampus.value = true;
		validEstagio.value = true;
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

	const showCursos = async () => {
		try {
			isShowing.value = true;
			errorMessageTable.value = [];
			const response = await axios.get("/cursos/index", { params: {} });
			cursos.value = response.data || [];
		} catch (error) {
			handleError(error);
		} finally {
			isShowing.value = false;
		}
	};

	const storeCurso = async () => {
		errorMessageForm.value = [];
		validDescricao.value = true;
		validCampus.value = true;
		validEstagio.value = true;

		if (
			!descricao.value ||
			descricao.value.length < constants.MIN_LENGTH_DESCRICAO
		) {
			validDescricao.value = false;
			errorMessageForm.value.push(this.$t("error.descricao-caracteres"));
		}
		if (!campus.value) {
			validCampus.value = false;
			errorMessageForm.value.push(this.$t("error.campus-selecionado"));
		}
		if (!obrigatorio.value && !naoObrigatorio.value) {
			validEstagio.value = false;
			errorMessageForm.value.push(this.$t("error.estagio-selecionado"));
		}

		if (errorMessageForm.value.length > 0) return;

		const payload = {
			descricao: descricao.value,
			obrigatorio: obrigatorio.value,
			naoObrigatorio: naoObrigatorio.value,
			campus: Number(campus.value),
		};

		try {
			isStoring.value = true;
			await axios.post("/admin/curso", payload);
			await showCursos();
			resetForm();
		} catch (error) {
			handleError(error);
		} finally {
			isStoring.value = false;
		}
	};

	const showDeleteModal = (id, modalDescricao, modalCampus) => {
		deleteId.value = id;
		deleteDescricao.value = modalDescricao;
		deleteCampus.value = modalCampus;
		deleteModal.value = true;
	};

	const hideDeleteModal = () => {
		deleteModal.value = false;
		deleteId.value = 0;
		deleteDescricao.value = "";
		deleteCampus.value = "";
	};

	const deleteCurso = async (id) => {
		hideDeleteModal();
		try {
			isDeleting.value = true;
			errorMessageTable.value = [];
			await axios.delete(`/admin/curso/${id}`);
			await showCursos();
		} catch (error) {
			handleError(error);
		} finally {
			isDeleting.value = false;
		}
	};

	onMounted(() => {
		loadCampi();
		showCursos();
	});
</script>

<template>
	<div>
		<AdminNavigation />

		<div class="container">
			<RoundedBox>
				<h3 class="text-center">{{ $t("header.admin.curso") }}</h3>

				<div class="sce-form">
					<form @submit.prevent="">
						<div
							:class="{
								'z-1': !activeDescricao && validDescricao,
								'z-2': !activeDescricao && !validDescricao,
								'z-3': activeDescricao,
							}"
							class="form-floating"
						>
							<input
								type="text"
								class="form-control sce-form-top"
								@focus="activeDescricao = true"
								@blur="activeDescricao = false"
								:class="{ 'is-invalid': !validDescricao }"
								id="coordenadorEstagioNome"
								name="coordenadorEstagioNome"
								placeholder="Descrição"
								v-model.trim="descricao"
								autocomplete="off"
							/>
							<label for="coordenadorEstagioNome">{{
								$t("label.descricao")
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
								id="coordenadorEstagioCampus"
								name="coordenadorEstagioCampus"
							>
								<option
									v-for="c in campi"
									:key="c.id"
									:value="c.id"
								>
									{{ c.descricao }}
								</option>
							</select>
							<label for="coordenadorEstagioCampus">{{
								$t("label.campus")
							}}</label>
						</div>

						<div
							class="mt-2"
							:class="{ 'is-invalid-div': !validEstagio }"
						>
							<div class="mx-4 mt-4">
								<div class="fw-bold">
									{{
										$t("message.admin.modalidades-estagio")
									}}
								</div>

								<div class="mt-2 form-check">
									<input
										class="form-check-input"
										type="checkbox"
										id="obrigatorio"
										v-model="obrigatorio"
									/>
									<label
										class="form-check-label"
										for="obrigatorio"
									>
										{{ $t("label.obrigatorio") }}
									</label>
								</div>

								<div class="mt-2 mb-4 form-check">
									<input
										class="form-check-input"
										type="checkbox"
										id="naoObrigatorio"
										v-model="naoObrigatorio"
									/>
									<label
										class="form-check-label"
										for="naoObrigatorio"
									>
										{{ $t("label.nao-obrigatorio") }}
									</label>
								</div>
							</div>
						</div>

						<div class="text-center">
							<button
								class="w-25 mt-3 btn btn-outline-success opacity-75"
								type="submit"
								@click="storeCurso"
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
						cursos.length == 0
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
						cursos.length > 0
					"
				>
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">{{ $t("label.descricao") }}</th>
							<th scope="col">{{ $t("label.campus") }}</th>
							<th
								class="text-center"
								scope="col"
							>
								{{ $t("label.obrigatorio") }}
							</th>
							<th
								class="text-center"
								scope="col"
							>
								{{ $t("label.nao-obrigatorio") }}
							</th>
							<th scope="col"></th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="c in cursos"
							:key="c.id"
						>
							<th scope="row">{{ c.id }}</th>
							<td>{{ c.descricao }}</td>
							<td>{{ getDescricaoCampus(c.campus) }}</td>
							<td class="text-center">
								<i
									class="bi bi-check"
									v-show="c.obrigatorio"
								></i>
							</td>
							<td class="text-center">
								<i
									class="bi bi-check"
									v-show="c.naoObrigatorio"
								></i>
							</td>
							<td class="text-center">
								<i
									class="bi bi-trash"
									@click="
										showDeleteModal(
											c.id,
											c.descricao,
											getDescricaoCampus(c.campus)
										)
									"
								></i>
							</td>
						</tr>
					</tbody>
				</table>
			</RoundedBox>

			<!-- Modal para deletar um curso -->
			<Teleport to="body">
				<DeleteModal
					operation="delete"
					:show="deleteModal"
					:id="deleteId"
					@close="hideDeleteModal"
					@delete="deleteCurso"
				>
					<template #body>
						<p class="text-center fw-bold">
							{{ $t("message.admin.delete-curso") }}
						</p>
						<p class="text-center text-danger">
							{{ deleteDescricao }}<br />
							{{ $t("label.campus") }} {{ deleteCampus }}
						</p>
					</template>
				</DeleteModal>
			</Teleport>
		</div>
	</div>
</template>
