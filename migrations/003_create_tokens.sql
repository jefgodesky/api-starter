CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uid UUID REFERENCES users (id),
    refresh UUID DEFAULT uuid_generate_v4(),
    token_expiration TIMESTAMP DEFAULT NOW() + INTERVAL $TOKEN_EXPIRATION,
    refresh_expiration TIMESTAMP DEFAULT NOW() + INTERVAL $REFRESH_EXPIRATION
);
