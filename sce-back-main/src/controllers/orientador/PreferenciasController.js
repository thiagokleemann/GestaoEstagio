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
        

        let cursosOrientador = null;

        try {
            cursosOrientador = await CursoUsuario.findAll({
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


        const cursos = cursosOrientador.map(e => e.curso);

        const orientador = {
            nome: usuario.nome,
            email: req.email,
            campus: {
                id: req.campus,
                descricao: campus.descricao,
            },
            cursos,
            //curso: (cursosOrientador && cursosOrientador.curso) ? cursosOrientador.curso : null,
        }

        return res.status(200).json(orientador);
    }


    async update(req, res) {
        
        const schema = Yup.object().shape({
            nome: Yup.string().min(constants.MIN_LENGTH_NOME).required().strict(),
            cursos: Yup.array().required().strict(),
        });

        if (!(await schema.isValid(req.body)))
            return res
                .status(400)
                .json({ error: res.i18n.t("schema-invalido") });

        let { nome, cursos } = req.body;

        // Verifica se o orientador ja foi cadastrado.
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

            // Atualiza ou cadastra os cursos do orientador
            let cursosOrientador = null;

            try {
                cursosOrientador = await CursoUsuario.findAll({
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

            // transforma em array / remove duplicados
            cursosOrientador = cursosOrientador.map(e => e.curso);
            cursosOrientador = Array.from(new Set(cursosOrientador));
            
            // cursos para adicionar e remover
            cursos = Array.from(new Set(cursos));
            const cursosAdicionar = cursos.filter(e => !cursosOrientador.includes(e));
            const cursosRemover = cursosOrientador.filter(e => !cursos.includes(e));

            
            if(cursosAdicionar)
                for (let i = 0; i < cursosAdicionar.length; i++) {
                    const curso = cursosAdicionar[i];
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

            if(cursosRemover)
                for (let i = 0; i < cursosRemover.length; i++) {
                    const curso = cursosRemover[i];
                    try {
                        const cursoOrientador = await CursoUsuario.findOne({
                            where: { 
                                curso,
                                usuario: req.uid, 
                            },
                        });
                        
                        await cursoOrientador.destroy();
                
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
