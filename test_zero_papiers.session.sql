-- @block
SELECT * FROM documents;

-- @block
ALTER TABLE documents ADD mime_type VARCHAR(100) NOT NULL;

-- @block
ALTER TABLE documents ADD chemin_fichier TEXT NOT NULL;

-- @block
ALTER TABLE users ADD user_uuid VARCHAR(36) NOT NULL UNIQUE;

-- @block
ALTER TABLE documents DROP FOREIGN KEY documents_ibfk_1;

-- @block
ALTER TABLE documents MODIFY user_id VARCHAR(36);

-- @block
ALTER TABLE documents RENAME COLUMN user_id to user_uuid;



-- @block
ALTER TABLE documents 
ADD CONSTRAINT fk_documents_user_id 
FOREIGN KEY (user_id) REFERENCES users(uuid);

-- @block
INSERT INTO users (
    uuid,
    nom,
    prenom,
    email,
    password,
    role
)
VALUES (
    UUID(),
    'Administrateur',
    'Principal',
    'admin@zeropapier.ci',
    '$2b$10$n2QP6nL45dPn7XxqhBhWxOaRmwDhWsXKq1pS53ORo8/iKqVvanvfy',
    'ADMIN'
);

--@block
CREATE TABLE partages_temporaires (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id VARCHAR(100) UNIQUE NOT NULL,
    admin_uuid VARCHAR(100) NOT NULL,
    client_uuid VARCHAR(100) NOT NULL,
    status ENUM('en_attente', 'accepte', 'refuse') DEFAULT 'en_attente',
    documents_partages JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);