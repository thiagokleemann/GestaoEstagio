import Yup from "yup";
import Usuario from "../../models/Usuario.js";
import Campus from "../../models/Campus.js";
import Curso from "../../models/Curso.js";
import CursoUsuario from "../../models/CursoUsuario.js";
import constants from "../../config/constants.js";

class CoordenadorCursoController {

    async index(_req, res) {
        
        let cursoUsuario = null;

        try {
            cursoUsuario = await CursoUsuario.findAll({
                attributes: ["id"],
                include: [
                    {
                      model: Usuario,
                      attributes: ["id", "nome", "email", "campus", "ativo"],
                      where: {
                        tipo: constants.COORDENADOR_CURSO,
                      }
                    },
                    {
                      model: Curso,
                      attributes: ["id", "descricao"],
                    },
                ],
                where: {

                }
            });
        } catch (error) {
            return res
                .status(503)
                .json({ error: res.i18n.t("banco-dados-indisponivel") });
        }

        const usuarios = cursoUsuario.map( e => {
            return {
                id: e.Usuario.id,
                nome: e.Usuario.nome,
                email: e.Usuario.email,
                campus: e.Usuario.campus,
                ativo: e.Usuario.ativo,
                curso: e.Curso.descricao,
            }
        });

        return res.status(200).json(usuarios);
    }
    

    async store(req, res) {

        const schema = Yup.object().shape({
            nome: Yup.string().min(constants.MIN_LENGTH_NOME).required().strict(),
            email: Yup.string().email().required(),
            ativo: Yup.boolean().required().strict(),
            campus: Yup.number().integer().min(constants.MIN_CAMPUS).max(constants.MAX_CAMPUS).required().strict(),
            tipo: Yup.number().integer().oneOf([constants.COORDENADOR_CURSO]).required().strict(),
            curso: Yup.number().integer().min(constants.MIN_CURSO).required().strict(),
        });

        if (!(await schema.isValid(req.body)))
            return res
                .status(400)
                .json({ error: res.i18n.t("schema-invalido") });

        const { email, nome, ativo, campus, tipo, curso } = req.body;


        // Verifica se o coordenador de curso ja foi cadastrado.
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



        // Verifica se o curso existe no BD
        let cursoSelecionado = null;
        try {
            cursoSelecionado = await Curso.findOne({
                where: { id: curso },
            });
        } catch (error) {
            return res
                .status(503)
                .json({ error: res.i18n.t("banco-dados-indisponivel") });
        }

        if (!cursoSelecionado)
            return res
                .status(400)
                .json({ error: res.i18n.t("curso-nao-encontrado") });



        // Pode haver apenas um unico coordenador por curso.
        // Verifica se o curso ja tem um coordenador.
        let cursoUsuario = null;

        try {
            cursoUsuario = await CursoUsuario.findOne({
                attributes: ["id"],
                where: {
                    curso,
                },
                include: [
                    {
                      model: Usuario,
                      required: true,
                      where: {
                        tipo,
                      }
                    }
                  ],
            });
        } catch (error) {
            return res
                .status(503)
                .json({ error: res.i18n.t("banco-dados-indisponivel") });
        }

        if(cursoUsuario) {
            return res
                    .status(400)
                    .json({ error: res.i18n.t("restricao-coordenador-curso") });
        }


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


        // Realiza o cadastro do novo usuario (coordenador de curso)
        const body = {
            nome,
            email,
            ativo,
            campus,
            tipo,
        };

        try {
            usuario = await Usuario.create(body);
        } catch (error) {
            return res
                .status(503)
                .json({ error: res.i18n.t("banco-dados-indisponivel") });
        }

        const { id } = usuario;


        // *** REVISAR *** 
        // O ideal seria ter ambas operacoes como uma transaction

        // Cria associacao do usuario (coordenador) com o curso
        cursoUsuario = null;
        try {
            cursoUsuario = await CursoUsuario.create({
                usuario: id,
                curso,
            });
        } catch (error) {
            return res
                .status(503)
                .json({ error: res.i18n.t("banco-dados-indisponivel") });
        }

        return res.status(201).json({
            id,
            nome,
            email,
            ativo,
            campus,
            tipo,
            curso,
        });
    }
   
    async destroy(req, res) {

        const schema = Yup.object().shape({
            id: Yup.number().integer().min(constants.MIN_DB_INDEX).required(),
        });

        if (!(await schema.isValid(req.params)))
            return res
                .status(400)
                .json({ error: res.i18n.t("schema-invalido") });

        const { id } = req.params;

        let usuario = null;

        try {
            usuario = await Usuario.findOne({
                where: { id },
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

        if(Number(usuario.tipo) !== Number(constants.COORDENADOR_CURSO))
            return res
                .status(503)
                .json({ error: res.i18n.t("usuario-nao-coordenador-curso") });
                

        let cursoUsuario = null;
        try {
            cursoUsuario = await CursoUsuario.findAll({
                where: {
                    usuario: id,
                }
            });
        } catch (error) {
            return res
                .status(503)
                .json({ error: res.i18n.t("banco-dados-indisponivel") });
        }
        
        try {
            if(cursoUsuario) 
                cursoUsuario.forEach(c => c.destroy())
            await usuario.destroy();
        } catch (error) {
            return res
                .status(503)
                .json({ error: res.i18n.t("banco-dados-indisponivel") });
        }

        return res.status(200).send();
    }
    
}

export default new CoordenadorCursoController();
