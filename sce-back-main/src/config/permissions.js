const permissionConfig = {

    // Administrador(a)
    0: [
        "post/admin/curso",
        "delete/admin/curso/:id",
        
        "get/admin/coordenador/estagio",
        "post/admin/coordenador/estagio",
        "delete/admin/coordenador/estagio/:id",

        "get/admin/coordenador/curso",
        "post/admin/coordenador/curso",
        "delete/admin/coordenador/curso/:id",

        "get/admin/orientador",
        "post/admin/orientador",
        "delete/admin/orientador",

        "get/admin/usuarios",
        "delete/admin/usuario/:id",
    ],

    // Coordenador(a) de Estágio
    1: [
        "get/coordenador/estagio/usuarios",
        "get/coordenador/estagio/orientador",
        "post/coordenador/estagio/orientador",
    ],

    // Coordenador(a) do Curso
    2: [],

    // Orientador(a)
    3: [
        "get/orientador/preferencias",
        "put/orientador/preferencias",
    ],

    // Aluno(a)
    4: [
        "get/aluno/preferencias",
        "put/aluno/preferencias",
        "get/aluno/ConfirmacaoEstagio/:tipo",
        "post/aluno/ConfirmacaoEstagio",
    ],


    // Tipo de Usuario Indefinido
    1000: [],
};

export default permissionConfig;
