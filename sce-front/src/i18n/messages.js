import { createI18n } from "vue-i18n";

const i18n = createI18n({
	locale: "pt",
	fallbackLocale: "en",
	messages: {
		en: {
			message: {
				hello: "hello world",
			},
		},
		pt: {
			message: {
				admin: {
					"sem-coordenadores-estagio":
						"Não há coordenadores de estágios cadastrados no sistema.",
					"sem-coordenadores-curso":
						"Não há coordenadores de curso cadastrados no sistema.",
					"sem-orientadores":
						"Não há orientadores cadastrados no sistema.",
					"sem-usuarios":
						"Não há usuários que satisfaçam o critério de exibição.",
					"delete-coordenador-estagio":
						"Você deseja remover o seguinte coordenador de estágios?",
					"delete-coordenador-curso":
						"Você deseja remover o seguinte coordenador de curso?",
					"delete-orientador":
						"Você deseja remover o seguinte orientador?",
					"delete-usuario": "Você deseja remover o seguinte usuário?",
					"delete-curso": "Você deseja remover o seguinte curso?",
					"modalidades-estagio":
						"Modalidades de estágio disponíveis no curso:",
				},
				coordenador: {
					estagio: {
						"sem-alunos": "Não há alunos cadastrados.",
					},
					curso: {},
				},
				login: {
					google: "Entrar com Google.",
					"fail-p1": "Não foi possível entrar com o email ",
					"fail-p2":
						" pois o mesmo não está habilitado no sistema. São aceitos somente emails institucionais com domínio ",
					dominio: "ifrs.edu.br.",
				},
			},
			error: {
				"nome-caracteres": "O nome deve ter pelo menos 3 caracteres.",
				"descricao-caracteres":
					"A descrição deve ter pelo menos 3 caracteres.",
				"email-formato": "O email deve ter um formato válido.",
				"password-tamanho":
					"O password deve ter pelo menos 6 caracteres.",
				"campus-selecionado": "O campus deve ser selecionado.",
				"estagio-selecionado":
					"Pelo menos uma das modalidades de estágio deve ser selecionada.",
				"curso-selecionado": "O curso deve ser selecionado.",
				"cursos-selecionados":
					"Pelo menos um curso deve ser selecionado.",
				"nao-admin": "O usuário não é um administrador.",
				"nao-coordenador-estagio":
					"O usuário não é um coordenador de estágios.",
			},
			header: {
				admin: {
					"coordenador-estagio":
						"Cadastro de Coordenadores de Estágios",
					"coordenador-curso": "Cadastro de Coordenadores de Curso",
					orientador: "Cadastro de Orientadores",
					usuario: "Lista de Usuários",
					curso: "Cadastro de Cursos",
					preferencias: "Preferências",
				},
				coordenador: {
					estagio: {
						usuario: "Usuários",
						aluno: "Alunos",
						orientador: "Orientadores",
						curso: "Cursos",
						"coordenador-curso": "Coordenadores de Curso",
						preferencias: "Preferências",
					},
					curso: {
						aluno: "Alunos",
						orientador: "Orientadores",
						preferencias: "Preferências",
					},
				},
				orientador: {
					pedido: "Pedidos de Orientação",
					orientacao: "Orientações",
					preferencias: "Preferências",
				},
				aluno: {
					pedido: "Pedidos de Orientação",
					orientacao: "Orientações",
					preferencias: "Preferências",
					documentos: "Documentos",
				},
			},
			nav: {
				admin: {
					"coordenador-estagio": "Coordenadores de Estágios",
					"coordenador-curso": "Coordenadores de Curso",
					orientador: "Orientadores",
					usuario: "Lista de Usuários",
					curso: "Cursos",
					preferencias: "Preferências",
				},
				coordenador: {
					estagio: {
						usuario: "Usuários",
						aluno: "Alunos",
						orientador: "Orientadores",
						curso: "Cursos",
						"coordenador-curso": "Coordenadores de Curso",
						preferencias: "Preferências",
					},
					curso: {
						aluno: "Alunos",
						orientador: "Orientadores",
						preferencias: "Preferências",
					},
				},
				orientador: {
					pedido: "Pedidos de Orientação",
					orientacao: "Orientações",
					preferencias: "Preferências",
				},
				aluno: {
					pedido: "Pedidos de Orientação",
					orientacao: "Orientações",
					preferencias: "Preferências",
					documentos: "Documentos",
				},
			},
			button: {
				delete: "Remover",
				cancel: "Cancelar",
				store: "Cadastrar",
				update: "Atualizar",
				reset: "Reset",
				show: "Exibir",
				login: "Entrar",
				logout: "Sair",
				yes: "Sim",
				no: "Não",
				ok: "OK",
			},
			label: {
				nome: "Nome",
				email: "Email",
				campus: "Campus",
				curso: "Curso",
				descricao: "Descrição",
				password: "Password",
				obrigatorio: "Estágio obrigatório",
				"nao-obrigatorio": "Estágio não obrigatório",
				todos: "Todos",
				tipo: "Tipo",
			},
		},
	},
});

export default i18n;
