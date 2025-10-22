import Yup from "yup";
import Usuario from "../../models/Usuario.js";
import Campus from "../../models/Campus.js";
import CursoUsuario from "../../models/CursoUsuario.js";
import constants from "../../config/constants.js";
import Documento from "../../models/Documento.js"

class alunoConfirmacaoEstagioController {
    async show (req, res){
        
        let documento = null;
        const {tipo} = req.params

       try {
            documento = await Documento.findOne({
            where: {idAluno: req.uid, tipo} //Colocar tipo no request
        });
        } catch (error) {
             return res
                .status(503)
                .json({ error: res.i18n.t("banco-dados-indisponivel") });
        }
        /*console.log(req);
         documento = await Documento.findOne({            
            where: {idAluno: req.uid}
        });*/


        const testeDoc = {
            id: documento.id,
            path: documento.path,
            tipo: documento.tipo,
            status: documento.status,
            idDocAnterior: documento.idDocAnterior,
            idAluno: documento.idAluno,
            idOrientador: documento.idOrientador
        }

        return res.status(200).json(testeDoc);
    }



    async store (req, res){

        const { file } = req;
        if (!file) {
            return res.status(400).json({ error: "Arquivo PDF é obrigatório." });
        }
        
        const schema = Yup.object().shape({
            tipo: Yup.number().integer(),
            status: Yup.number().integer(),
            idDocAnterior: Yup.number().integer(),
            idAluno: Yup.number().integer(),
            idOrientador: Yup.number().integer(),
        });

        if (!(await schema.isValid(req.body)))
            return res
                .status(400)
                .json({ error: res.i18n.t("schema-invalido") });

        const {tipo, status, idDocAnterior, idAluno, idOrientador} = req.body;

        

        const body = {
            path: file.path,
            tipo,
            status,
            idDocAnterior,
            idAluno,
            idOrientador,
        };

        let documento = null;
        
        //console.log(body)
        //documento = await Documento.create(body);
        
        
        try{
            documento = await Documento.create(body);
        }catch(error){
            return res
                .status(503)
                .json({ error: res.i18n.t("banco-dados-indisponivel") });
        }

        const {id} = documento;

        return res.status(201).json({
            id,
            path: file.path,
            tipo,
            status,
            idDocAnterior,
            idAluno,
            idOrientador,
        });


    }   






}

export default new alunoConfirmacaoEstagioController();