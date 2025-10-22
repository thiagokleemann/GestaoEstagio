import Yup from "yup";
import Curso from "../../models/Curso.js";
import constants from "../../config/constants.js";


/**
 * Esta classe possui apenas o store() e o destroy() pois
 * o index() e o show() sao compartilhados entre todos os usuarios
 * atraves do controller em /shared/
 */
class CursoController {
    
    async store(req, res) {

        const schema = Yup.object().shape({
            descricao: Yup.string().min(constants.MIN_LENGTH_DESCRICAO).required().strict(),
            obrigatorio: Yup.boolean().required(),
            naoObrigatorio: Yup.boolean().required(),
            campus: Yup.number().integer().min(constants.MIN_CAMPUS).max(constants.MAX_CAMPUS),
        });

        if (!(await schema.isValid(req.body)))
            return res
                .status(400)
                .json({ error: res.i18n.t("schema-invalido") });

        const { descricao, obrigatorio, naoObrigatorio, campus } = req.body;


        // Verifica se o curso ja foi cadastrado no campus.
        // Em um campus, pode haver apenas um curso com uma data descricao.
        let curso = null;

        try {
            curso = await Curso.findOne({
                where: { descricao, campus },
            });
        } catch (error) {
            return res
                .status(503)
                .json({ error: res.i18n.t("banco-dados-indisponivel") });
        }

        if (curso)
            return res
                .status(400)
                .json({ error: res.i18n.t("curso-cadastrado") });

        // Realiza o cadastro do novo curso
        const body = {
            descricao,
            obrigatorio,
            naoObrigatorio,
            campus,
        };

        try {
            curso = await Curso.create(body);
        } catch (error) {
            return res
                .status(503)
                .json({ error: res.i18n.t("banco-dados-indisponivel") });
        }

        const { id } = curso;

        return res.status(201).json({
            id,
            descricao,
            campus,
        });
    }

    async destroy(req, res) {
        const schema = Yup.object().shape({
            id: Yup.number().integer().min(constants.MIN_CURSO).required(),
        });

        if (!(await schema.isValid(req.params)))
            return res
                .status(400)
                .json({ error: res.i18n.t("schema-invalido") });

        const { id } = req.params;

        let curso = null;
        
        try {
            curso = await Curso.findByPk(id);
        } catch (error) {
            return res
                .status(503)
                .json({ error: res.i18n.t("banco-dados-indisponivel") });
        }

        if (!curso)
            return res
                .status(400)
                .json({ error: res.i18n.t("curso-nao-encontrado") });

        try {
            await curso.destroy();
        } catch (error) {
            return res
                .status(503)
                .json({ error: res.i18n.t("banco-dados-indisponivel") });
        }

        return res.status(200).send();
    }
}

export default new CursoController();