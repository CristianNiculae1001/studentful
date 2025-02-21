CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    verification_token VARCHAR(4),
    token_expiration_date TIMESTAMP,
    active BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW() 
);

-- Catalog Data JSON Structure

-- [
--     {
--         "an": {
--             "sem1": [
--                 {
--                     name: "Materia 1",
--                     note: [4,5,6],
--                     credite: 4,
--                 },
--                 {
--                     name: "Materia 2",
--                     note: [7,8,9],
--                     credite: null
--                 },
--                 {
--                     name: "Materia 3",
--                     note: [6, 9, 4],
--                     credite: 5
--                 }
--             ],
--             "sem2": [
--                 {
--                     name: "Materia 1",
--                     note: [4,5,6],
--                     credite: 4,
--                 },
--                 {
--                     name: "Materia 2",
--                     note: [7,8,9],
--                     credite: null
--                 },
--                 {
--                     name: "Materia 3",
--                     note: [6, 9, 4],
--                     credite: 5
--                 }
--             ],
--         }
--     }
-- ]

CREATE TABLE catalog (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE note (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    title VARCHAR NOT NULL,
    tag VARCHAR,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE note_item (
    id SERIAL PRIMARY KEY,
    note_id INTEGER REFERENCES note(id) NOT NULL,
    description VARCHAR NOT NULL,
    isCompleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE editor_modification (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    content VARCHAR NOT NULL,
    tag VARCHAR,
    subject VARCHAR,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
);

CREATE TYPE access_type AS ENUM ('private', 'public', 'restricted');

CREATE TABLE link (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    title VARCHAR NOT NULL,
    url VARCHAR NOT NULL,
    label VARCHAR NOT NULL,
    -- access enum ('public', 'private', 'restricted')
    access access_type NOT NULL DEFAULT 'private',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE link_access (
    id SERIAL PRIMARY KEY,
    link_id INTEGER REFERENCES link(id) NOT NULL,
    author_id INTEGER REFERENCES users(id) NOT NULL,
    guest_id INTEGER REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE credentials (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    service VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- https://dev.to/rone/how-to-build-a-password-manager-with-nodejs-part-1-34i5 - password manager