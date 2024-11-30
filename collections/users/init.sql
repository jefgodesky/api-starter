CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR (255) NOT NULL,
    username VARCHAR (255) UNIQUE,
    key UUID NOT NULL DEFAULT uuid_generate_v4()
);
