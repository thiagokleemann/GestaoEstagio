const constants = {
    
    // TIPOS DE USUÁRIO
    ADMIN: 0,
    COORDENADOR_ESTAGIO: 1,
    COORDENADOR_CURSO: 2,
    ORIENTADOR: 3,
    ALUNO: 4,

    // SCHEMA BOUNDS
    MIN_ZERO: 0,
    MIN_DB_INDEX: 1,
    MIN_CAMPUS: 1,
    MAX_CAMPUS: 17,
    MIN_TIPO_USUARIO: 1,
    MAX_TIPO_USUARIO: 4,
    UNDEF_TIPO_USUARIO: 1000,
    MIN_LENGTH_NOME: 3,
    MIN_LENGTH_DESCRICAO: 3,
    MIN_CURSO: 1,
    MIN_USUARIO: 1,

    // GOOGLE OAUTH
    OAUTH_USER_DATA_URL: "https://www.googleapis.com/oauth2/v3/userinfo?access_token=",
    OAUTH_SCOPE_URL: "https://www.googleapis.com/auth/userinfo.profile openid email",

}

Object.freeze(constants);

export default constants;