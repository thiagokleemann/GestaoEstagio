import Yup from "yup";
import Documento from "../../models/Documento.js";
import Estagio from "../../models/Estagio.js";
import path from "path";

class alunoDocumento {

    // Função show (renomeada para showByType na conversa anterior, mas mantendo show aqui para compatibilidade com a rota original)
	async show(req, res) { 
		let documento = null;
		const { tipo } = req.params;

		try {
			// Busca documentos pelo tipo E pelo idPostador (aluno logado)
			documento = await Documento.findOne({
				where: {
					tipo: tipo,
					idPostador: req.uid, 
				},
				order: [["id", "DESC"]], 
			});
		} catch (error) {
			console.error("Erro DB (show):", error); // Log
			return res
				.status(503)
				.json({ error: res.i18n.t("banco-dados-indisponivel") });
		}

		if (!documento) {
			return res
				.status(404) // Usar 404 Not Found
				.json({ error: res.i18n.t("consulta-sem-retorno") });
		}

		// Buscar dados do estágio associado (se houver)
		let estagio = null;
		if (documento.idEstagio) {
			try {
				estagio = await Estagio.findByPk(documento.idEstagio);
			} catch (dbError){
				console.error("Erro DB (show - buscar estagio):", dbError); // Log
                // Continua mesmo se não encontrar o estágio, mas retorna dados parciais
			}
		}

		// Monta a resposta
		const documentoRetorno = {
			id: documento.id,
			path: documento.path,
			tipo: documento.tipo,
			status: documento.status,
			idEstagio: estagio ? estagio.id : null,
			ativo: estagio ? estagio.ativo : null,
			idAluno: estagio ? estagio.idAluno : null,
			idOrientador: estagio ? estagio.idOrientador : null,
		};

		return res.status(200).json(documentoRetorno);
	}

    // Função de Download (corrigida e simplificada)
	async download(req, res){
		let documento = null;
		
		try {
			// Busca o documento mais recente do tipo especificado, postado pelo usuário logado
			documento = await Documento.findOne({
				where: { 
					tipo: req.params.tipo,
					idPostador: req.uid // Filtra pelo aluno logado
				}, 
				order:[["id","DESC"]] // Pega o mais recente
			});
		} catch(error) {
			 console.error("Erro ao buscar documento para download:", error); 
			 return res
				.status(503)
				.json({ error: res.i18n.t("banco-dados-indisponivel") });
		}

		// Verifica se o documento foi encontrado no banco
		if(!documento){
			return res
				.status(404) 
				.json({ error: res.i18n.t("consulta-sem-retorno") });
		}
		
		try {
			// Resolve o caminho absoluto do arquivo no servidor
			const caminhoAbsoluto = path.resolve(documento.path); 
			
			console.log(`Tentando baixar o arquivo de: ${caminhoAbsoluto}`); 

			// Usa res.download() para forçar o download com o nome original
			// Adiciona callback para tratamento de erro no envio do arquivo
			return res.download(caminhoAbsoluto, (err) => {
				if (err) {
					console.error("Erro ao enviar o arquivo com res.download:", err);
					if (err.code === 'ENOENT') { // ENOENT = Error No Entry (arquivo não existe)
					   return res.status(404).json({ error: "Arquivo não encontrado no servidor." });
					}
					// Outro erro durante o envio
					return res.status(500).json({ error: "Erro ao processar o download do arquivo." });
				}
				// Se o download for bem-sucedido, o callback é chamado sem erro
				console.log(`Arquivo ${caminhoAbsoluto} enviado com sucesso.`);
			});

		} catch (resolveError) {
			 console.error("Erro ao resolver o caminho do arquivo:", resolveError);
			 return res.status(500).json({ error: "Erro interno ao localizar o arquivo." });
		}
	}


	// Função Store (para upload)
	async store (req, res){

		const status = 1; // Todo documento começa como aguardando
		let idEstagio = null; 
		const idPostador = req.uid; // id do aluno logado

		let estagio = null;
		try {
			estagio = await Estagio.findOne({ 	// Select para encontrar o idEstágio do estágio ativo atual do aluno
				where: {idAluno: req.uid, ativo: true},
			});
		}catch(error){
			console.error("Erro DB (store - buscar estagio):", error); // Log
			return res
				.status(503)
				.json({ error: res.i18n.t("banco-dados-indisponivel") });
		}
		if (!estagio){
			return res.status(400).json({ error: "Sem estágio ativo para associar o documento." }); // Mensagem mais clara
		}
		idEstagio = estagio.id; 

		const { file } = req;
		if (!file) {
			return res.status(400).json({ error: "Arquivo PDF é obrigatório." });
		}
		
		const schema = Yup.object().shape({
			tipo: Yup.number().integer().required(), // Tornar o tipo obrigatório
		});

		// Validar o req.body (onde o 'tipo' vem do FormData)
		if (!(await schema.isValid(req.body))) {
			// Se o schema for inválido, é importante remover o arquivo que foi salvo pelo multer
            if (file && file.path) {
                const fs = await import('fs').catch(e => console.error("Erro ao importar fs:", e));
                if (fs && fs.existsSync(file.path)) {
                    fs.unlink(file.path, (unlinkErr) => {
                        if (unlinkErr) console.error("Erro ao remover arquivo após falha de validação:", unlinkErr);
                    });
                }
            }
			return res
				.status(400)
				.json({ error: res.i18n.t("schema-invalido") + " (Verifique se o 'tipo' foi enviado)" });
        }


		const { tipo } = req.body;

		const body = {
			path: file.path,
			tipo,
			status,
			idEstagio,
			idPostador,
		};

		let documentoCriado = null;		
		
		try{
			documentoCriado = await Documento.create(body);
		}catch(error){
			console.error("Erro DB (store - criar documento):", error); // Log
            // Remover arquivo se falhar ao salvar no DB
            if (file && file.path) {
                const fs = await import('fs').catch(e => console.error("Erro ao importar fs:", e));
                 if (fs && fs.existsSync(file.path)) {
                    fs.unlink(file.path, (unlinkErr) => {
                        if (unlinkErr) console.error("Erro ao remover arquivo após falha no DB:", unlinkErr);
                    });
                }
            }
			return res
				.status(503)
				.json({ error: res.i18n.t("banco-dados-indisponivel") });
		}

		// Retorna os dados do documento criado
		return res.status(201).json({
			id: documentoCriado.id,
			path: documentoCriado.path,
			tipo: documentoCriado.tipo,
			status: documentoCriado.status,
			idEstagio: documentoCriado.idEstagio,
			idPostador: documentoCriado.idPostador,
		});
	} 	
}

export default new alunoDocumento();