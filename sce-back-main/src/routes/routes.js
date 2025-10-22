import { Router } from "express";
import upload from "../config/multer.js";

import authenticationMiddleware from "../middlewares/authenticationMiddleware.js";
import checkPermission from "../middlewares/accessControlMiddleware.js";

// Estes Controllers possuem apenas index() e show()
import CampusController from "../controllers/shared/CampusController.js";
import CursoController from "../controllers/shared/CursoController.js";
import TipoUsuarioController from "../controllers/shared/TipoUsuarioController.js";

import ModeloDocumentoController from "../controllers/shared/ModeloDocumentoController.js";

// Google Auth
import SessionController from "../controllers/login/SessionController.js";

// Admin Controllers (renomeados - prefixo Admin)
import AdminCoordenadorEstagioController from "../controllers/admin/CoordenadorEstagioController.js";
import AdminCoordenadorCursoController from "../controllers/admin/CoordenadorCursoController.js";
import AdminOrientadorController from "../controllers/admin/OrientadorController.js";
import AdminUsuarioController from "../controllers/admin/UsuarioController.js";
import AdminCursoController from "../controllers/admin/CursoController.js";

// Coordenador(a) de Estagios routes
import CoordenadorEstagioUsuarioController from "../controllers/coordenador/estagio/UsuarioController.js";
import CoordenadorEstagioOrientadorController from "../controllers/coordenador/estagio/OrientadorController.js";

// Coordenador(a) de Curso routes


// Orientador(a) routes
import OrientadorPreferenciasController from "../controllers/orientador/PreferenciasController.js";


// Aluno(a) Controllers
import AlunoPreferenciasController from "../controllers/aluno/PreferenciasController.js";
import alunoDocumento from "../controllers/aluno/alunoDocumento.js";


const routes = new Router();


// ********************************************************************************
// Rotas de login (nao requerem autenticacao)
// ********************************************************************************
routes.post("/session", SessionController.oAuthRequest);
routes.get("/session", SessionController.oAuthCallback);
routes.post("/admin/session", SessionController.store);



// ********************************************************************************
// Autenticacao: confirma que um usuario eh quem ele diz ser.
// Adiciona as seguintes properties ao objeto 'req': uid, nome, email, tipo
// ********************************************************************************
routes.use(authenticationMiddleware);



// ********************************************************************************
// Shared routes (compartilhadas entre todos tipos de usuario)
// Rotas que requerem autenticação mas sao permitidas para todos usuarios
// Nao eh necessario incluir o middleware checkPermission()
// ********************************************************************************
routes.get("/usuario/info", SessionController.show);
routes.get("/cursos/index", CursoController.index);
routes.get("/cursos", CursoController.show);
routes.get("/tipos/index", TipoUsuarioController.index);
routes.get("/campi/index", CampusController.index);
routes.delete("/session", SessionController.destroy);

routes.get("/download/:id", ModeloDocumentoController.download);



// ********************************************************************************
// Rotas restritas a certos tipos de usuario (verificado na propriedade req.tipo)
// DEVEM incluir o middleware checkPermission(method/route)
// ********************************************************************************

// ********************************************************************************
// Admin routes
// ********************************************************************************

routes.post(
    "/admin/curso",
    checkPermission("post/admin/curso"),
    AdminCursoController.store
);

routes.delete(
    "/admin/curso/:id",
    checkPermission("delete/admin/curso/:id"),
    AdminCursoController.destroy
);

routes.get(
    "/admin/coordenador/estagio",
    checkPermission("get/admin/coordenador/estagio"),
    AdminCoordenadorEstagioController.index
);

routes.post(
    "/admin/coordenador/estagio",
    checkPermission("post/admin/coordenador/estagio"),
    AdminCoordenadorEstagioController.store
);

routes.delete(
    "/admin/coordenador/estagio/:id",
    checkPermission("delete/admin/coordenador/estagio/:id"),
    AdminCoordenadorEstagioController.destroy
);

routes.get(
    "/admin/coordenador/curso",
    checkPermission("get/admin/coordenador/curso"),
    AdminCoordenadorCursoController.index
);

routes.post(
    "/admin/coordenador/curso",
    checkPermission("post/admin/coordenador/curso"),
    AdminCoordenadorCursoController.store
);

routes.delete(
    "/admin/coordenador/curso/:id",
    checkPermission("delete/admin/coordenador/curso/:id"),
    AdminCoordenadorCursoController.destroy
);


routes.get(
    "/admin/orientador",
    checkPermission("get/admin/orientador"),
    AdminOrientadorController.index
);

routes.post(
    "/admin/orientador",
    checkPermission("post/admin/orientador"),
    AdminOrientadorController.store
);

routes.delete(
    "/admin/orientador/:id",
    checkPermission("delete/admin/orientador/:id"),
    AdminOrientadorController.destroy
);

routes.get(
    "/admin/usuarios",
    checkPermission("get/admin/usuarios"),
    AdminUsuarioController.index
);

routes.delete(
    "/admin/usuario/:id",
    checkPermission("delete/admin/usuario/:id"),
    AdminUsuarioController.destroy
);




// ************************************************
// Coordenador(a) de Estagios routes
// ************************************************
routes.get(
    "/coordenador/estagio/usuarios",
    checkPermission("get/coordenador/estagio/usuarios"),
    CoordenadorEstagioUsuarioController.index
);


routes.get(
    "/coordenador/estagio/orientador",
    checkPermission("get/coordenador/estagio/orientador"),
    CoordenadorEstagioOrientadorController.index
);

routes.post(
    "/coordenador/estagio/orientador",
    checkPermission("post/coordenador/estagio/orientador"),
    CoordenadorEstagioOrientadorController.store
);


// routes.get(
//     "/coordenador/estagio/alunos",
//     checkPermission("get/coordenador/estagio/alunos"),
//     CoordenadorEstagioAlunoController.index
// );


// ************************************************
// Coordenador(a) de Curso routes
// ************************************************



// ************************************************
// Orientador(a) routes
// ************************************************
routes.get(
    "/orientador/preferencias",
    checkPermission("get/orientador/preferencias"),
    OrientadorPreferenciasController.show
);

routes.put(
    "/orientador/preferencias",
    checkPermission("put/orientador/preferencias"),
    OrientadorPreferenciasController.update
);


// ************************************************
// Aluno(a) routes
// ************************************************
routes.get(
    "/aluno/preferencias",
    checkPermission("get/aluno/preferencias"),
    AlunoPreferenciasController.show
);

routes.put(
    "/aluno/preferencias",
    checkPermission("put/aluno/preferencias"),
    AlunoPreferenciasController.update
);


/*routes.get(
    "/aluno/ConfirmacaoEstagio",
    checkPermission("get/aluno/ConfirmacaoEstagio"),
    alunoDocumento.show
)*/

routes.get(
    "/aluno/Documento/:tipo",
    checkPermission("get/aluno/ConfirmacaoEstagio/:tipo"),
    alunoDocumento.show
)

routes.get(
    "/aluno/Documento/:tipo/download",
    //checkPermission("get/aluno/ConfirmacaoEstagio/:tipo/download"),
    alunoDocumento.download
)

routes.post(
    "/aluno/Documento",
    checkPermission("post/aluno/ConfirmacaoEstagio"),
    upload.single("arquivo"),
    alunoDocumento.store
)


export default routes;
