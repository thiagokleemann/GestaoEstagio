<script setup>
	const logout = () => {
		this.$store.dispatch("logout");
		this.$router.replace("/");
	};
</script>

<template>
	<nav class="navbar navbar-expand-md navbar-dark small fs-6">
		<div class="container-fluid">
			<div class="navbar-brand px-5">
				<img
					src="@/assets/logo-white.png"
					alt="SCE"
					width="80px"
					class="d-inline-block align-text-top"
				/>
			</div>

			<button
				class="navbar-toggler"
				type="button"
				data-bs-toggle="collapse"
				data-bs-target="#navbarSupportedContent"
				aria-controls="navbarSupportedContent"
				aria-expanded="false"
				aria-label="Toggle navigation"
			>
				<span class="navbar-toggler-icon"></span>
			</button>

			<div
				class="collapse navbar-collapse"
				id="navbarSupportedContent"
			>
				<ul class="navbar-nav me-auto mb-2 mb-lg-0">
					<li class="nav-item">
						<router-link
							class="nav-link px-3"
							to="/aluno/orientacao"
							>{{ $t("nav.aluno.orientacao") }}</router-link
						>
					</li>
					<li class="nav-item">
						<router-link
							class="nav-link px-3"
							to="/aluno/pedido"
							>{{ $t("nav.aluno.pedido") }}</router-link
						>
					</li>
					<li class="nav-item">
						<router-link
							class="nav-link px-3"
							to="/aluno/documentos"
							>{{ $t("nav.aluno.documentos") }}</router-link
						>
					</li>
					<li class="nav-item">
						<router-link
							class="nav-link px-3"
							to="/aluno/preferencias"
							>{{ $t("nav.aluno.preferencias") }}</router-link
						>
					</li>
				</ul>
				<span class="navbar-nav">
					<router-link
						class="nav-link px-3"
						to="/"
					>
						<button
							class="w-100 mt-3 btn btn-outline-light opacity-75"
							type="submit"
							@click="logout"
						>
							{{ $t("button.logout") }}
						</button>
					</router-link>
				</span>
			</div>
		</div>
	</nav>
</template>

<style scoped>
	nav {
		background-image: linear-gradient(
			rgba(0, 0, 0, 0.1),
			rgba(0, 0, 0, 0.2)
		);
	}
</style>
