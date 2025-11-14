-- Inserisce l'utente admin
INSERT INTO users (id, email, password_hash)
VALUES ('d4fc91cb-a6cd-4e59-9ca2-c284ecf34dd0', 'giose.rizzi@gmail.com', 'HASH_DEL_PASSWORD');

-- Inserisce il profilo admin
INSERT INTO profiles (id, full_name, role)
VALUES ('d4fc91cb-a6cd-4e59-9ca2-c284ecf34dd0', 'Josè Rizzi', 'admin');

-- Inserisce campi di esempio
INSERT INTO courts (id, name) VALUES
(gen_random_uuid(), 'Campo 1'),
(gen_random_uuid(), 'Campo 2'),
(gen_random_uuid(), 'Campo 3');
