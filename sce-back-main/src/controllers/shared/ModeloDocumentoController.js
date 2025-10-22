/*
Precisa ter documentos pré cadastrados já, usar a partir do banco V6
IDs dos modelos de documentos no banco estágio obrigatório:

1 - Carta Apresentação de Estágio 
2 - Termo de compromisso de Orientação (confirmação de orientação de estágio)
3 - Ficha de confirmação de Estagio
4 - Plano de atividades 
5 - Autorização de uso de imagem 
6 - Avaliação da concedente
7 - Avaliação do orientador de estágio 
8 - Convênio de Estágio
9 - Termo de compromisso de estágio
10 - Termo aditivo ao conênio 
11 - Termo aditivo ao termo de compromisso
12 - Requerimento validação de atividades profissionais
13 - Declaração de atividdes profissionais

IDs dos modelos no banco, estágio não obrigatório:

14 - Carta de Apresentação de estágio
15 - Aceite de orientação de estágio não obrigatório
16 - Ficha de confirmação de estagio 
17 - Plano de atividades do estágiario
18 - Relatório parcial de estágio não obrigatório 
19 - Relatório final de estágio não obrigatório 
20 - Convênio de Estágio 
21 - Termo de compromisso de Estágio 
22 - Termo aditivo ao convênio
23 - Termo aditivo ao termo de compromisso
*/

import Documento from "../../models/Documento.js"
import path from "path";

class ModeloDocumento{

    async download(req, res){
        let documento = null;

        try {
            documento = await Documento.findOne({
                where: {id: req.params.id}
            })
        } catch (error) {
            return res
                .status(503)
                .json({ error: res.i18n.t("banco-dados-indisponivel") });
        }

        return res.status(200).download(path.resolve(documento.path))
    }
    
}

export default new ModeloDocumento();