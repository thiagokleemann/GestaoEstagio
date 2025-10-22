import Yup from "yup";
import Usuario from "../../models/Usuario.js";
import Campus from "../../models/Campus.js";
import CursoUsuario from "../../models/CursoUsuario.js";
import constants from "../../config/constants.js";

class PreferenciasController {

    async show(req, res) {

        let usuario = null;

        try {
            usuario = await Usuario.findOne({
                where: { email: req.email },
            });
        } catch (error) {
            return res
                .status(503)
                .json({ error: res.i18n.t("banco-dados-indisponivel") });
        }

        let campus = null;        

        try {
            campus = await Campus.findOne({
                attributes: ["descricao"],
                where: { id: req.campus },
            });

        } catch (error) {
            return res
                .status(503)
                .json({ error: res.i18n.t("banco-dados-indisponivel") });
        }
        

        let cursoAluno = null;

        try {
            cursoAluno = await CursoUsuario.findOne({
                attributes: ["curso"],
                where: {
                    usuario: req.uid,
                },
            });
        } catch (error) {
            return res
                .status(503)
                .json({ error: res.i18n.t("banco-dados-indisponivel") });
        }

        const aluno = {
            nome: usuario.nome,
            email: req.email,
            campus: {
                id: req.campus,
                descricao: campus.descricao,
            },
            curso: (cursoAluno && cursoAluno.curso) ? cursoAluno.curso : null,
        }

        return res.status(200).json(aluno);
    }


    async update(req, res) {
        
        const schema = Yup.object().shape({
            nome: Yup.string().min(constants.MIN_LENGTH_NOME).required().strict(),
            curso: Yup.number().integer().min(constants.MIN_CURSO).required().strict(),
        });

        if (!(await schema.isValid(req.body)))
            return res
                .status(400)
                .json({ error: res.i18n.t("schema-invalido") });

        const { nome, curso } = req.body;

        // Verifica se o aluno ja foi cadastrado.
        // O email eh um campo unique no BD.
        let usuario = null;

        try {
            usuario = await Usuario.findOne({
                where: { email: req.email },
            });
        } catch (error) {
            return res
                .status(503)
                .json({ error: res.i18n.t("banco-dados-indisponivel") });
        }

        if (!usuario)
            return res
                .status(400)
                .json({ error: res.i18n.t("usuario-nao-encontrado") });
        else {
            // Atualiza o nome
            try {
                await usuario.update({ nome });
            } catch (error) {
                return res.status(401).json({error: res.i18n.t("banco-dados-indisponivel")});
            }

            // Atualiza ou cadastra o curso do aluno
            let cursoAluno = null;

            try {
                cursoAluno = await CursoUsuario.findOne({
                    attributes: ["id", "curso"],
                    where: {
                        usuario: req.uid,
                    },
                });

            } catch (error) {
                return res
                    .status(503)
                    .json({ error: res.i18n.t("banco-dados-indisponivel") });
            }

            if(cursoAluno) {
                // Atualiza o curso
                try {
                    await cursoAluno.update({ curso });
                } catch (error) {
                    return res.status(401).json({error: res.i18n.t("banco-dados-indisponivel")});
                }

            } else {
                
                try {
                    await CursoUsuario.create( {
                        curso,
                        usuario: req.uid,
                    });                    
                } catch (error) {
                    return res
                        .status(503)
                        .json({ error: res.i18n.t("banco-dados-indisponivel") });
                }
            }

        }

        return res.status(200).json();
    }

}

export default new PreferenciasController();
