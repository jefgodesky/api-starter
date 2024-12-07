CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uid UUID REFERENCES users (id),
    refresh UUID DEFAULT uuid_generate_v4(),
    expires TIMESTAMP DEFAULT NOW() + INTERVAL '10 minutes'
);
