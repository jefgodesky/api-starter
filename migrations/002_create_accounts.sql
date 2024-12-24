CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE provider AS ENUM ('google', 'discord', 'github');

CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uid UUID REFERENCES users (id) ON DELETE CASCADE,
    provider provider,
    pid VARCHAR(255)
);
