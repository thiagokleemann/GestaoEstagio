// Middleware para controle de acesso baseado em permissoes e tipos de usuario.
// Permissao nao deve ser confundida com autenticacao:
// - Autenticacao diz respeito a um usuario que logou no sistema.
// - Pode ser permitido (ou nao) que um usuario autenticado acesse um determinado recurso.
import permissionConfig from "../config/permissions.js";
import constants from "../config/constants.js";

export default function (route) {
    return (req, res, next) => {
        
        let tipo = parseInt(req.tipo);
        tipo = isNaN(tipo) ? constants.UNDEF_TIPO_USUARIO : tipo;
        const permissions = permissionConfig[tipo];

        if (permissions.includes(route)) {
            return next();
        }

        return res.status(403).json({ error: res.i18n.t("nao-permitido") });
    };
}
