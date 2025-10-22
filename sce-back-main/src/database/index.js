import Sequelize from "sequelize";

import CursoUsuario from "../models/CursoUsuario.js";
import PedidoOrientacao from "../models/PedidoOrientacao.js";
import Orientacao from "../models/Orientacao.js";
import Curso from "../models/Curso.js";
import Usuario from "../models/Usuario.js";
import TipoUsuario from "../models/TipoUsuario.js";
import Campus from "../models/Campus.js";
import Admin from "../models/Admin.js";
import Documento from "../models/Documento.js"
import Estagios from "../models/Estagio.js";

import databaseConfig from "../config/database.js";

const models = [
    CursoUsuario,
    PedidoOrientacao,
    Orientacao,
    Curso,
    Usuario,
    TipoUsuario,
    Campus,
    Admin,
    Documento,
    Estagios,
];

class Database {
    constructor() {
        this.init();
    }

    init() {
        // Faz a conexão com o BD
        this.connection = new Sequelize(databaseConfig);

        // Carrega os models e associaçoes com map
        models
            .map((model) => model.init(this.connection))
            .map(
                (model) =>
                    model.associate && model.associate(this.connection.models)
            );
    }
}

export default new Database();
