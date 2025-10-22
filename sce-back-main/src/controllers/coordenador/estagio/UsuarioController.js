import Yup from "yup";
import Usuario from "../../../models/Usuario.js";
import constants from "../../../config/constants.js";

class UsuarioController {

    async index(req, res) {
        const schema = Yup.object().shape({
            tipo: Yup.number()
                .integer()
                .min(constants.MIN_ZERO)
                .max(constants.MAX_TIPO_USUARIO)
                .required(),
            campus: Yup.number()
                .integer()
                .min(constants.MIN_ZERO)
                .max(constants.MAX_CAMPUS)
                .required(),
        });

        if (!(await schema.isValid(req.query)))
            return res
                .status(400)
                .json({ error: res.i18n.t("schema-invalido") });

        const { tipo, campus } = req.query;

        let usuarios = null;

        try {
            usuarios = await Usuario.findAll({
                attributes: ["id", "nome", "email", "campus", "tipo", "ativo"],
                where: {
                    ...(tipo > constants.MIN_ZERO && { tipo }),
                    ...(campus > constants.MIN_ZERO && { campus }),
                },
            });
        } catch (error) {
            return res
                .status(503)
                .json({ error: res.i18n.t("banco-dados-indisponivel") });
        }

        return res.status(200).json(usuarios);
    }
}

export default new UsuarioController();
