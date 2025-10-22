import i18nCreate from "express-rest-i18n";

const i18n = i18nCreate({
    defaultLocale: "pt-br",
    messages: {
        "pt-br": {
            "nao-autenticado": "Usuário não autenticado.",
            "schema-invalido": "Schema inválido.",
            "usuario-nao-encontrado": "Usuário não encontrado.",
            "campus-nao-encontrado": "Campus não encontrado.",
            "curso-nao-encontrado": "Curso não encontrado.",
            "password-incorreto": "Password incorreto.",
            "nao-permitido": "Usuário sem permissão.",
            "usuario-cadastrado": "Usuário já cadastrado.",
            "usuario-nao-coordenador-estagio": "O usuário não é um coordenador de estágio.",
            "usuario-nao-coordenador-curso": "O usuário não é um coordenador de curso.",
            "usuario-nao-orientador": "O usuário não é um orientador.",
            "curso-cadastrado": "Curso já cadastrado.",
            "curso-nao-encontrado": "Curso não encontrado",
            "restricao-coordenador-estagio": "Coordenador de estágios já cadastrado para este campus.",
            "restricao-coordenador-curso": "Coordenador já cadastrado para este curso.",
            "restricao-admin": "Administrador já cadastrado.",
            "restricao-email-instituicao": "Use um email institucional compatível com o domínio do campus.",
            "erro-sintaxe-json": "Erro de sintaxe do JSON.",
            "banco-dados-indisponivel": "Erro no Banco de Dados.",
            "erro-google-auth": "Erro na autenticação com o Google.",
            "token-nao-encontrado": "Token não encontrado.",
        },
    },
});

export default i18n;
