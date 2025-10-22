import TipoUsuario from "../../models/TipoUsuario.js";

class TipoUsuarioController {
    
    async index(_req, res) {
        
        let tiposUsuario = null;

        try {
            tiposUsuario = await TipoUsuario.findAll({
                attributes: ["id", "descricao"],
            });
        } catch (error) {
            return res
                .status(503)
                .json({ error: res.i18n.t("banco-dados-indisponivel") });
        }

        return res.status(200).json(tiposUsuario);
    }
}

export default new TipoUsuarioController();
