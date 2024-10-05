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