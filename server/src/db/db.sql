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