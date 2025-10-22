import jwt from "jsonwebtoken";

export default async (req, res, next) => {

    if (req.cookies && req.cookies.token) {
        const cookieToken = req.cookies.token ? req.cookies.token : null;
        
        if (cookieToken) {
            try {
                const decoded = await jwt.verify(
                    cookieToken,
                    process.env.CLIENT_SECRET
                );
                
                req.uid = decoded.uid;
                req.email = decoded.email;
                req.tipo = decoded.tipo;
                req.campus = decoded.campus;

                return next();
            } catch (error) {
                return res
                    .status(401)
                    .json({ error: res.i18n.t("nao-autenticado") });
            }
        }


        return res.status(401).json({ error: res.i18n.t("nao-autenticado") });
    }

    return res.status(401).json({ error: res.i18n.t("token-nao-encontrado") });
};
