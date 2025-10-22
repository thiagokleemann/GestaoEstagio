import Yup from "yup";
import jwt from "jsonwebtoken";
import Usuario from "../../models/Usuario.js";
import Campus from "../../models/Campus.js";
import Admin from "../../models/Admin.js";
import { OAuth2Client } from "google-auth-library";
import constants from "../../config/constants.js";

async function getUserData(accessToken) {
    const response = await fetch(
        `${constants.OAUTH_USER_DATA_URL}${accessToken}`
    );
    return await response.json();
}

class SessionController {
    /**
     * Método de autenticação usado por todos usuários, exceto pelo ADMIN.
     * Retorna a URL do Google para que o usuário possa se autentica.
     * Após autenticado, será chamado o método de callback (oAuthCallback).
     */
    async oAuthRequest(_req, res) {
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Referrer-Policy", "no-referrer-when-downgrade");

        const redirectURL = process.env.URL_BACKEND_REDIRECT;

        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            redirectURL
        );

        const authorizeUrl = oAuth2Client.generateAuthUrl({
            access_type: "offline",
            scope: constants.OAUTH_SCOPE_URL,
            prompt: "consent",
        });

        res.json({ url: authorizeUrl });
    }

    /**
     * Método de callback chamado pelo Google após a autenticação.
     * É usado por todos usuários, exceto pelo ADMIN.
     *
     * Ainda que o Google forneça um token, a aplicação usa um novo
     * token gerado localmente, contendo como payload dados do usuário:
     * { uid, nome, email, tipo, campus }. Estes dados são necessários
     * para facilitar a identificação do tipo do usuário e suas
     * respectivas permissões.
     */
    async oAuthCallback(req, res) {
        const code = req.query.code;

        try {
            const redirectURL = process.env.URL_BACKEND_REDIRECT;

            const oAuth2Client = new OAuth2Client(
                process.env.CLIENT_ID,
                process.env.CLIENT_SECRET,
                redirectURL
            );

            const r = await oAuth2Client.getToken(code);
            oAuth2Client.setCredentials(r.tokens);
            const data = await getUserData(
                oAuth2Client.credentials.access_token
            );

            const { email, email_verified, name: nomeGoogle } = data;

            if (email_verified) {
                let usuario = null;

                try {
                    usuario = await Usuario.findOne({ where: { email } });
                } catch (error) {
                    return res.status(503).json({
                        error: res.i18n.t("banco-dados-indisponivel"),
                    });
                }

                if (!usuario) {

                    // Se o usuário for um aluno, verifica se o email
                    // é institucional e qual é o campus do aluno

                    if (email.includes("@aluno")) {
                        const [, dominio] = email.split("@aluno.");
                        

                        let campusAluno = null;
                        try {
                            campusAluno = await Campus.findOne({
                                attributes: ["id"],
                                where: { dominio },
                            });
                        } catch (error) {
                            return res.status(503).json({
                                error: res.i18n.t("banco-dados-indisponivel"),
                            });
                        }

                        if (campusAluno) {

                            // Realiza o cadastro do novo usuario (aluno)
                            const alunoDados = {
                                nome: nomeGoogle,
                                email,
                                ativo: true,
                                campus: campusAluno.id,
                                tipo: constants.ALUNO,
                            };

                            let aluno = null;

                            try {
                                aluno = await Usuario.create(alunoDados);
                            } catch (error) {
                                return res.status(503).json({
                                    error: res.i18n.t(
                                        "banco-dados-indisponivel"
                                    ),
                                });
                            }

                            // REVISAR 
                            // ESSE IF ABAIXO CREIO NAO SER NECESSARIO
                            if (aluno)
                                try {
                                    usuario = await Usuario.findOne({
                                        where: { email },
                                    });
                                } catch (error) {
                                    return res.status(503).json({
                                        error: res.i18n.t(
                                            "banco-dados-indisponivel"
                                        ),
                                    });
                                }
                        }
                    } else {
                        // Se não for aluno, deve ser adicionado manualmente pelo Admin ou Coordenador de Estagio do Campus.
                        // Nesse caso, apenas redireciona (sem criar o cookie).
                        return res.redirect(
                            303,
                            `${process.env.URL_ERROR_REDIRECT}?email=${email}`
                        );
                    }
                }

                const { id: uid, tipo, campus } = usuario;
                const expiresIn = oAuth2Client.credentials.expiry_date;

                const token = jwt.sign(
                    { uid, email, tipo, campus },
                    process.env.CLIENT_SECRET,
                    { expiresIn }
                );

                const cookieSettings = {
                    expires: new Date(expiresIn),
                    domain: process.env.DOMAIN,
                    httpOnly: true,
                    ...(process.env.NODE_ENV === "production" && {
                        secure: true,
                    }),
                };

                res.cookie("token", token, cookieSettings);
            }
        } catch (error) {
            return res
                .status(400)
                .json({ error: res.i18n.t("erro-google-auth") });
        }

        res.redirect(303, process.env.URL_GOOGLE_REDIRECT);
    }

    /**
     * Login ADMIN
     * Este login é usado exclusivamente pelo ADMIN.
     * É o único tipo de usuário que usar email/password.
     */
    async store(req, res) {
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required().strict(),
        });

        if (!(await schema.isValid(req.body)))
            return res
                .status(400)
                .json({ error: res.i18n.t("schema-invalido") });

        const { email, password } = req.body;

        let admin = null;

        try {
            admin = await Admin.findOne({ where: { email } });
        } catch (error) {
            return res
                .status(503)
                .json({ error: res.i18n.t("banco-dados-indisponivel") });
        }

        if (!admin)
            return res
                .status(400)
                .json({ error: res.i18n.t("usuario-nao-encontrado") });

        if (!(await admin.checkPassword(password)))
            return res
                .status(400)
                .json({ error: res.i18n.t("password-incorreto") });

        const { id: uid } = admin;
        const expiresIn = process.env.DEFAULT_EXPIRATION;
        const tipo = constants.ADMIN;
        const campus = 0;

        const token = jwt.sign(
            { uid, email, tipo, campus },
            process.env.CLIENT_SECRET,
            { expiresIn }
        );

        const cookieSettings = {
            maxAge: process.env.COOKIE_MAX_AGE,
            domain: process.env.DOMAIN,
            httpOnly: true,
            ...(process.env.NODE_ENV === "production" && { secure: true }),
        };

        res.cookie("token", token, cookieSettings);

        return res.status(200).json();
    }

    /**
     * Retorna dados do usuario apos o login para que seja
     * criada a session. Caso o usuário seja um ADMIN, os
     * dados sao obtidos de uma tabela especifica. 
     */
    async show(req, res) {

        let usuario = null;

        try {
            if(req.tipo === constants.ADMIN)
                usuario = await Admin.findOne({ 
                    where: { email: req.email } 
                });
            else
                usuario = await Usuario.findOne({ 
                    where: { email: req.email } 
                });

        } catch (error) {
            return res.status(503).json({
                error: res.i18n.t("banco-dados-indisponivel"),
            });
        }

        return res.status(200).json({
            uid: req.uid,
            nome: (usuario && usuario.nome) ? usuario.nome : '',
            email: req.email,
            tipo: req.tipo,
            campus: req.campus,
        });
    }

    async destroy(_req, res) {
        res.clearCookie("token");
        return res.status(200).json();
    }
}

export default new SessionController();
