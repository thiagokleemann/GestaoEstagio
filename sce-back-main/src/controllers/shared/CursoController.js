import Yup from "yup";
import Curso from "../../models/Curso.js";
import constants from "../../config/constants.js";

class CursoController {
    
    async index(_req, res) {
        
        let cursos = null; 

        try {
            cursos = await Curso.findAll({
                attributes: ["id", "descricao", "obrigatorio", "naoObrigatorio", "campus"],
            });
        } catch (error) {
            return res
                .status(503)
                .json({ error: res.i18n.t("banco-dados-indisponivel") });
        }

        return res.status(200).json(cursos);
    }
    
    async show(req, res) {
        
        const schema = Yup.object().shape({
            campus: Yup.number().integer().min(constants.MIN_CAMPUS).max(constants.MAX_CAMPUS).required(),
        });

        if (!(await schema.isValid(req.query)))
            return res
                .status(400)
                .json({ error: res.i18n.t("schema-invalido") });

        const { campus } = req.query;

        let cursos = null; 

        try {
            cursos = await Curso.findAll({
                attributes: ["id", "descricao", "obrigatorio", "naoObrigatorio", "campus"],
                where: { campus },
            });
        } catch (error) {
            return res
                .status(503)
                .json({ error: res.i18n.t("banco-dados-indisponivel") });
        }

        return res.status(200).json(cursos);
    }
}

export default new CursoController();
