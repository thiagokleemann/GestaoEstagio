import Yup from "yup";
import Usuario from "../../../models/Usuario.js";
import Campus from "../../../models/Campus.js";
import constants from "../../../config/constants.js";

class OrientadorController {

    async index(req, res) {
        const schema = Yup.object().shape({
            campus: Yup.number().integer().min(constants.MIN_CAMPUS).max(constants.MAX_CAMPUS),
        });

        if (!(await schema.isValid(req.query)))
            return res
                .status(400)
                .json({ error: res.i18n.t("schema-invalido") });

        const { campus } = req.query;

        let usuarios = null;

        try {
            usuarios = await Usuario.findAll({
                attributes: ["id", "nome", "email", "campus", "tipo", "ativo"],
                where: {
                    tipo: constants.ORIENTADOR,
                    ...(campus > 0 && { campus }),
                },
            });
        } catch (error) {
            return res
                .status(503)
                .json({ error: res.i18n.t("banco-dados-indisponivel") });
        }

        return res.status(200).json(usuarios);
    }

    async store(req, res) {
        
        const schema = Yup.object().shape({
            nome: Yup.string().min(constants.MIN_LENGTH_NOME).required().strict(),
            email: Yup.string().email().required(),
            ativo: Yup.boolean().required().strict(),
            campus: Yup.number().integer().min(constants.MIN_CAMPUS).max(constants.MAX_CAMPUS).required().strict(),
            tipo: Yup.number().required().oneOf( [ constants.ORIENTADOR ]),
        });

        if (!(await schema.isValid(req.body)))
            return res
                .status(400)
                .json({ error: res.i18n.t("schema-invalido") });

        const { email, nome, ativo, campus, tipo } = req.body;

        // Verifica se o coordenador de estagio ja foi cadastrado.
        // O email eh um campo unique no BD.
        let usuario = null;

        try {
            usuario = await Usuario.findOne({
                where: { email },
            });
        } catch (error) {
            return res
                .status(503)
                .json({ error: res.i18n.t("banco-dados-indisponivel") });
        }

        if (usuario)
            return res
                .status(400)
                .json({ error: res.i18n.t("usuario-cadastrado") });


        // Deve ser usado o email institucional do campus selecionado
        // Usamos o dominio do campus para verificar essa restricao
        let campusSelecionado = null;
        try {
            campusSelecionado = await Campus.findOne({
                attributes: ["dominio"],
                where: { id: campus },
            });
        } catch (error) {
            return res
                .status(503)
                .json({ error: res.i18n.t("banco-dados-indisponivel") });
        }

        if (campusSelecionado) {
            if (!email.endsWith(campusSelecionado.dominio))
                return res
                    .status(400)
                    .json({ error: res.i18n.t("restricao-email-instituicao") });
        } else
            return res
                .status(400)
                .json({ error: res.i18n.t("campus-nao-encontrado") });

        // Realiza o cadastro do novo usuario
        const body = {
            nome,
            email,
            campus,
            tipo,
            ativo,
        };

        try {
            usuario = await Usuario.create(body);
        } catch (error) {
            console.log(error);

            return res
                .status(503)
                .json({ error: res.i18n.t("banco-dados-indisponivel") });
        }

        const { id } = usuario;

        return res.status(201).json({
            id,
            nome,
            email,
            campus,
            tipo,
            ativo,
        });
    }
}

export default new OrientadorController();
