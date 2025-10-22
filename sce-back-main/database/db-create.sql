---
--- No pgAdmin 4 criar um Login/Group Roles:
--- General -> Name: sce
--- Definition -> Password: bingo123 (temporário).
--- Privileges -> Marcar Can login? Create databases? e Inherit rights..
--- Não é preciso alterar os demais settings.
--- Save.
---
--- Criar uma Database:
--- General -> Name: sce / Owner: sce
--- Save.
---
--- Executar o script abaixo conectado com o login sce.
--- Caso execute o script abaixo com o usuário postgres no pgAdmin 4
--- será necessário dar permissão explicitamente para o user sce.
--- 


---
--- drop tables (if exists)
---
DROP TABLE IF EXISTS "CursoUsuario";
DROP TABLE IF EXISTS "PedidoOrientacao";
DROP TABLE IF EXISTS "Orientacao";
DROP TABLE IF EXISTS "Curso";
DROP TABLE IF EXISTS "Admin";
DROP TABLE IF EXISTS "Usuario";
DROP TABLE IF EXISTS "TipoUsuario";
DROP TABLE IF EXISTS "Campus";


---
--- create tables
---


CREATE TABLE "Campus" (
  "id" SERIAL PRIMARY KEY,
  "descricao" VARCHAR NOT NULL,
  "dominio" VARCHAR NOT NULL,
  "createdAt" DATE DEFAULT CURRENT_DATE,
  "updatedAt" DATE DEFAULT CURRENT_DATE
);

INSERT INTO "Campus" ("descricao", "dominio") VALUES
('Alvorada', 'alvorada.ifrs.edu.br'),
('Bento Gonçalves', 'bento.ifrs.edu.br'),
('Canoas', 'canoas.ifrs.edu.br'),
('Caxias do Sul', 'caxias.ifrs.edu.br'),
('Erechim', 'erechim.ifrs.edu.br'),
('Farroupilha', 'farroupilha.ifrs.edu.br'),
('Feliz', 'feliz.ifrs.edu.br'),
('Ibirubá', 'ibiruba.ifrs.edu.br'),
('Osório', 'osorio.ifrs.edu.br'),
('Porto Alegre', 'poa.ifrs.edu.br'),
('Restinga', 'restinga.ifrs.edu.br'),
('Rio Grande', 'riogrande.ifrs.edu.br'),
('Rolante', 'rolante.ifrs.edu.br'),
('Sertão', 'sertao.ifrs.edu.br'),
('Vacaria', 'vacaria.ifrs.edu.br'),
('Veranópolis', 'veranopolis.ifrs.edu.br'),
('Viamão', 'viamao.ifrs.edu.br');


CREATE TABLE "Curso" (
  "id" SERIAL PRIMARY KEY,
  "descricao" VARCHAR NOT NULL,
  "campus" INTEGER NOT NULL REFERENCES "Campus"("id"),
  "obrigatorio" BOOLEAN NOT NULL,
  "naoObrigatorio" BOOLEAN NOT NULL,
  "createdAt" DATE DEFAULT CURRENT_DATE,
  "updatedAt" DATE DEFAULT CURRENT_DATE
);

INSERT INTO "Curso" ("descricao", "campus", "obrigatorio", "naoObrigatorio") VALUES
('Técnico em Informática', 7, true, true),
('Técnico em Meio Ambiente', 7, true, true),
('Técnico em Química', 7, true, true),
('Técnico em Administração', 7, true, true),
('Superior em Análise e Desenvolvimento de Sistemas', 7, false, true),
('Superior em Tecnologia de Processos Gerenciais', 7, false, true),
('Licenciatura em Letras', 7, false, true),
('Licenciatura em Química', 7, false, true),
('Bacharelado em Engenharia Química', 7, false, true),
('Especialização em Gestão Escolar', 7, false, true),
('MBA em Gestão Empresarial', 7, false, true),
('Mestrado Profissional em Tecnologia e Engenharia de Materiais', 7, false, true);



CREATE TABLE "Admin" (
  "id" SERIAL PRIMARY KEY,
  "nome" VARCHAR NOT NULL,
  "email" VARCHAR NOT NULL,
  "passwordHash" VARCHAR NOT NULL,
  "createdAt" DATE DEFAULT CURRENT_DATE,
  "updatedAt" DATE DEFAULT CURRENT_DATE
);

-- username: sce@feliz.ifrs.edu.br  (email ficticio, ele não existe de fato)
-- senha: bingo123
INSERT INTO "Admin" ( "nome", "email", "passwordHash", "createdAt", "updatedAt") VALUES 
	('Administrador', 'sce@feliz.ifrs.edu.br', '$2a$08$0zHbcgaIlGuogOh/PT82ieD9OMIUvWwTMaMAThTvhs1vHXLbz4zCe', '2024-05-23', '2024-05-23');



CREATE TABLE "TipoUsuario" (
  "id" SERIAL PRIMARY KEY,
  "descricao" VARCHAR NOT NULL,
  "createdAt" DATE DEFAULT CURRENT_DATE,
  "updatedAt" DATE DEFAULT CURRENT_DATE
);

INSERT INTO "TipoUsuario" ("descricao") VALUES
  ('Coordenador(a) de Estágios'),
  ('Coordenador(a) de Curso'),
  ('Orientador(a)'),
  ('Aluno(a)');

CREATE TABLE "Usuario" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR NOT NULL UNIQUE,
  "nome" VARCHAR NOT NULL,
  "campus" INTEGER NOT NULL REFERENCES "Campus"("id"),
  "tipo" INTEGER REFERENCES "TipoUsuario"("id") NOT NULL,
  "ativo" BOOLEAN NOT NULL,
  "createdAt" DATE DEFAULT CURRENT_DATE,
  "updatedAt" DATE DEFAULT CURRENT_DATE
);

--- Coordenador(a) de Estágios
INSERT INTO "Usuario" ("campus", "createdAt", "email", "nome", "tipo", "ativo", "updatedAt") VALUES 
	(7, '2024-05-23', 'xxxxxxxxxxxxxxxxxxxxxxxxx@gmail.com', 'Sigrid Regia Huve', 1, true, '2024-05-23');

-- Coordenador(a) de Curso
INSERT INTO "Usuario" ("campus", "createdAt", "email", "nome", "tipo", "ativo", "updatedAt") VALUES 
	(7, '2024-05-23', 'yyyyyyyyyyyyyyyyyyyyyyyyy@gmail.com', 'Moser Silva Fagundes', 2, true, '2024-05-23');

-- Orientador(a)
INSERT INTO "Usuario" ("campus", "createdAt", "email", "nome",  "tipo", "ativo", "updatedAt") VALUES 
	(7, '2024-05-23', 'zzzzzzzzzzzzzzzzzzzzzzzz@feliz.ifrs.edu.br', 'Tiago Cinto', 3, true, '2024-05-23');

-- Aluno(a)
INSERT INTO "Usuario" ("campus", "createdAt", "email", "nome", "tipo", "ativo", "updatedAt") VALUES 
	(7, '2024-05-23', 'wwwwwwwwwwwwwwwwwwwwww@gmail.com', 'Andrius Zimmer', 4, true, '2024-05-23');



CREATE TABLE "CursoUsuario" (
  "id" SERIAL PRIMARY KEY,
  "usuario" INTEGER NOT NULL REFERENCES "Usuario"("id") ON DELETE CASCADE,
  "curso" INTEGER REFERENCES "Curso"("id") NOT NULL,
  "createdAt" DATE DEFAULT CURRENT_DATE,
  "updatedAt" DATE DEFAULT CURRENT_DATE
);

-- Com exceção do Coordenador(a) de Estágios, os demais usuários estão ligados a um ou mais cursos
INSERT INTO "CursoUsuario" ("createdAt", "curso", "updatedAt", "usuario") VALUES ('2024-05-23', 1, '2024-05-23', 2);
INSERT INTO "CursoUsuario" ("createdAt", "curso", "updatedAt", "usuario") VALUES ('2024-05-23', 1, '2024-05-23', 3);
INSERT INTO "CursoUsuario" ("createdAt", "curso", "updatedAt", "usuario") VALUES ('2024-05-23', 1, '2024-05-23', 4);


CREATE TABLE "PedidoOrientacao" (
  "id" SERIAL PRIMARY KEY,
  "aluno" INTEGER NOT NULL REFERENCES "Usuario"("id"),
  "orientador" INTEGER NOT NULL REFERENCES "Usuario"("id"),
  "obrigatorio" BOOLEAN NOT NULL,
  "createdAt" DATE DEFAULT CURRENT_DATE,
  "updatedAt" DATE DEFAULT CURRENT_DATE
);

CREATE TABLE "Orientacao" (
  "id" SERIAL PRIMARY KEY,
  "aluno" INTEGER NOT NULL REFERENCES "Usuario"("id"),
  "orientador" INTEGER NOT NULL REFERENCES "Usuario"("id"),
  "obrigatorio" BOOLEAN NOT NULL,
  "createdAt" DATE DEFAULT CURRENT_DATE,
  "updatedAt" DATE DEFAULT CURRENT_DATE
);


