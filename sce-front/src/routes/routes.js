import { createRouter, createWebHistory } from "vue-router";
import store from "@/store/index.js";
import constants from "@/misc/constants.js";

import AdminCurso from "@/components/admin/AdminCurso.vue";
import AdminCoordenadorEstagio from "@/components/admin/AdminCoordenadorEstagio.vue";
import AdminCoordenadorCurso from "@/components/admin/AdminCoordenadorCurso.vue";
import AdminOrientador from "@/components/admin/AdminOrientador.vue";
import AdminUsuario from "@/components/admin/AdminUsuario.vue";
import AdminPreferencias from "@/components/admin/AdminPreferencias.vue";

import CoordenadorEstagioUsuario from "@/components/coordenador/estagio/CoordenadorEstagioUsuario.vue";
import CoordenadorEstagioOrientador from "@/components/coordenador/estagio/CoordenadorEstagioOrientador.vue";
import CoordenadorEstagioCurso from "@/components/coordenador/estagio/CoordenadorEstagioCurso.vue";
import CoordenadorEstagioCoordenadorCurso from "@/components/coordenador/estagio/CoordenadorEstagioCoordenadorCurso.vue";

import CoordenadorCursoAluno from "@/components/coordenador/curso/CoordenadorCursoAluno.vue";
import CoordenadorCursoOrientador from "@/components/coordenador/curso/CoordenadorCursoOrientador.vue";

import OrientadorPedido from "@/components/orientador/OrientadorPedido.vue";
import OrientadorOrientacao from "@/components/orientador/OrientadorOrientacao.vue";
import OrientadorPreferencias from "@/components/orientador/OrientadorPreferencias.vue";

import AlunoPedido from "@/components/aluno/AlunoPedido.vue";
import AlunoOrientacao from "@/components/aluno/AlunoOrientacao.vue";
import AlunoPreferencias from "@/components/aluno/AlunoPreferencias.vue";
import AlunoDocumentos from "@/components/aluno/AlunoDocumentos.vue";

import AdminLogin from "@/components/admin/AdminLogin.vue";
import TheGoogleLogin from "@/components/google/TheGoogleLogin.vue";
import TheGoogleLoginChecker from "@/components/google/TheGoogleLoginChecker.vue";
import TheGoogleLoginError from "@/components/google/TheGoogleLoginError.vue";

const routes = createRouter({
	history: createWebHistory(),
	routes: [
		/***********************************************
		 * Rotas que nao requerem autenticacao
		 ***********************************************/
		{ path: "/", component: TheGoogleLogin },
		{ path: "/check", component: TheGoogleLoginChecker },
		{ path: "/admin", component: AdminLogin },
		{ path: "/error", component: TheGoogleLoginError },

		/***********************************************
		 * Rotas do 'Administrador(a)'
		 ***********************************************/
		{
			// Cadastro de Coordenador de Estágio (para qualquer campus)
			path: "/admin/coordenador/estagio",
			component: AdminCoordenadorEstagio,
			meta: { auth: true, tipo: constants.ADMIN },
		},
		{
			// Cadastro de Curso (para qualquer campus)
			path: "/admin/curso",
			component: AdminCurso,
			meta: { auth: true, tipo: constants.ADMIN },
		},
		{
			// Cadastro de Coordenador de Curso (para qualquer campus)
			path: "/admin/coordenador/curso",
			component: AdminCoordenadorCurso,
			meta: { auth: true, tipo: constants.ADMIN },
		},
		{
			// Cadastro de Orientador (para qualquer campus)
			path: "/admin/orientador",
			component: AdminOrientador,
			meta: { auth: true, tipo: constants.ADMIN },
		},
		{
			// Lista de usuários (todos campi e tipos)
			path: "/admin/lista/usuario",
			component: AdminUsuario,
			meta: { auth: true, tipo: constants.ADMIN },
		},
		{
			// Preferências do sistema
			path: "/admin/preferencias",
			component: AdminPreferencias,
			meta: { auth: true, tipo: constants.ADMIN },
		},

		/***********************************************
		 * Rotas do 'Coordenador(a) de Estagios'
		 ***********************************************/

		{
			// Lista de alunos em processo de estágio
			path: "/coordenador/estagio/lista/usuario",
			component: CoordenadorEstagioUsuario,
			meta: { auth: true, tipo: constants.COORDENADOR_ESTAGIO },
		},
		{
			// Cadastro de Orientador (para o seu campus somente)
			path: "/coordenador/estagio/orientador",
			component: CoordenadorEstagioOrientador,
			meta: { auth: true, tipo: constants.COORDENADOR_ESTAGIO },
		},
		{
			// Cadastro de Curso (para o seu campus somente)
			path: "/coordenador/estagio/curso",
			component: CoordenadorEstagioCurso,
			meta: { auth: true, tipo: constants.COORDENADOR_ESTAGIO },
		},
		{
			// Cadastro de Coordenador de Curso (para o seu campus somente)
			path: "/coordenador/estagio/coordenador",
			component: CoordenadorEstagioCoordenadorCurso,
			meta: { auth: true, tipo: constants.COORDENADOR_ESTAGIO },
		},

		/***********************************************
		 * Rotas do 'Coordenador(a) de Curso'
		 ***********************************************/
		{
			// Lista de alunos em processo de estágio
			path: "/coordenador/curso/lista/aluno",
			component: CoordenadorCursoAluno,
			meta: { auth: true, tipo: constants.COORDENADOR_CURSO },
		},
		{
			// Cadastro de Orientador (para o seu campus somente)
			path: "/coordenador/curso/orientador",
			component: CoordenadorCursoOrientador,
			meta: { auth: true, tipo: constants.COORDENADOR_CURSO },
		},

		/***********************************************
		 * Rotas do 'Orientador(a)'
		 ***********************************************/
		{
			// Pedidos de orientação
			path: "/orientador/pedido",
			component: OrientadorPedido,
			meta: { auth: true, tipo: constants.ORIENTADOR },
		},
		{
			// Orientações em Andamento
			path: "/orientador/orientacao",
			component: OrientadorOrientacao,
			meta: { auth: true, tipo: constants.ORIENTADOR },
		},
		{
			// Preferencias do Aluno
			path: "/orientador/preferencias",
			component: OrientadorPreferencias,
			meta: { auth: true, tipo: constants.ORIENTADOR },
		},

		/***********************************************
		 * Rotas do 'Aluno(a)'
		 ***********************************************/
		{
			// Pedidos de Orientação
			path: "/aluno/pedido",
			component: AlunoPedido,
			meta: { auth: true, tipo: constants.ALUNO },
		},
		{
			// Orientações em Andamento
			path: "/aluno/orientacao",
			component: AlunoOrientacao,
			meta: { auth: true, tipo: constants.ALUNO },
		},
		{
			// Preferencias do Aluno
			path: "/aluno/preferencias",
			component: AlunoPreferencias,
			meta: { auth: true, tipo: constants.ALUNO },
		},
		{
			// Documentos
			path: "/aluno/documentos",
			component: AlunoDocumentos,
			meta: { auth: true, tipo: constants.ALUNO },
		},

		/***********************************************
		 * Outras Rotas e Redirecionamentos
		 ***********************************************/
		{ path: "/:notFound(.*)", redirect: "/" },
	],

	linkActiveClass: "active",
});

routes.beforeEach(function (to, _from, next) {
	// Requer autenticacao
	if (to.meta.auth) {
		// Verifica se esta autenticado
		// e se a autenticacao eh do tipo requerido
		if (
			store.getters.isAuthenticated &&
			Number(store.getters.tipo) === Number(to.meta.tipo)
		) {
			next();
		} else {
			next("/");
		}
	} else {
		// Nao requer autenticacao
		next();
	}
});

export default routes;
