export default {
	uid(state) {
		return state.uid;
	},

	email(state) {
		return state.email;
	},

	nome(state) {
		return state.nome;
	},

	tipo(state) {
		return state.tipo;
	},

	campus(state) {
		return state.campus;
	},

	googleLoginUrl(state) {
		return state.googleLoginUrl;
	},

	isAuthenticated(state) {
		return !!(
			state.uid &&
			state.nome &&
			state.email &&
			state.tipo !== null &&
			state.campus !== null
		);
	},

	isAdmin(state) {
		return state.tipo === 0;
	},

	isCoordenadorEstagio(state) {
		return state.tipo === 1;
	},

	isCoordenadorCurso(state) {
		return state.tipo === 2;
	},

	isOrientador(state) {
		return state.tipo === 3;
	},

	isAluno(state) {
		return state.tipo === 4;
	},
};
