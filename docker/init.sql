-- Enables UUID generation (pgcrypto)
-- Creates games table with your columns
-- Inserts 2 rows

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DROP TABLE IF EXISTS games;

CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  genre TEXT NOT NULL,
  price INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO games (title, genre, price) VALUES
('Hades', 'Roguelike', 1999),
('Stardew Valley', 'Farming', 1499);
