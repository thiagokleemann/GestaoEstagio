const constants = {
    
    // TIPOS DE USUÁRIO
    ADMIN: 0,
    COORDENADOR_ESTAGIO: 1,
    COORDENADOR_CURSO: 2,
    ORIENTADOR: 3,
    ALUNO: 4,

    MIN_LENGTH_NOME: 3,
    MIN_LENGTH_DESCRICAO: 3,
    MIN_LENGTH_PASSWD: 6,

}

Object.freeze(constants);

export default constants;