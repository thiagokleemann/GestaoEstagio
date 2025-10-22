// *** REVISAR ***                
// nao funciona corretamente para JSON mal formados
// realize testes com o Insomnia ou Postman para verificar

export function jsonSyntaxMiddleware(err, _req, res, next) {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err)
        return res.status(400).json({ error: res.i18n.t("erro-sintaxe-json") });

    next();
}
