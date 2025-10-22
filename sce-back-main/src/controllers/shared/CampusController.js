import Campus from "../../models/Campus.js";

class CampusController {
    
    async index(_req, res) {
        let campi = null;

        try {
            campi = await Campus.findAll({
                attributes: ["id", "descricao", "dominio"],
            });
        } catch (error) {
            return res
                .status(503)
                .json({ error: res.i18n.t("banco-dados-indisponivel") });
        }

        return res.status(200).json(campi);
    }

}

export default new CampusController();
