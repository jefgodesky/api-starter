CREATE TYPE provider AS ENUM ('google', 'discord', 'github', 'apple');

CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uid UUID REFERENCES users (id),
    provider provider,
    pid VARCHAR(255)
);