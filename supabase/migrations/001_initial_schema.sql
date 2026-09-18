-- ============================================================
-- Fortuno — Migración 001: Esquema inicial
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- -------------------------------------------------------
-- ENUMS
-- -------------------------------------------------------
CREATE TYPE giveaway_status AS ENUM ('active', 'upcoming', 'completed', 'paused');
CREATE TYPE social_platform AS ENUM ('instagram', 'tiktok', 'youtube', 'x', 'facebook');
CREATE TYPE social_action_type AS ENUM ('follow', 'subscribe', 'share');

-- -------------------------------------------------------
-- TABLA: giveaways
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS giveaways (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug                    TEXT UNIQUE NOT NULL,
    title                   TEXT NOT NULL,
    subtitle                TEXT,
    description             TEXT,
    sorteo_number           INTEGER UNIQUE NOT NULL,
    status                  giveaway_status NOT NULL DEFAULT 'upcoming',

    -- Tickets & participación
    ticket_price            NUMERIC(10, 2) NOT NULL DEFAULT 0,
    currency                VARCHAR(3)     NOT NULL DEFAULT 'USD',
    max_participants        INTEGER,
    max_tickets             INTEGER,
    tickets_sold            INTEGER        NOT NULL DEFAULT 0,
    next_ticket_seq         INTEGER        NOT NULL DEFAULT 1,
    total_participants_count INTEGER       NOT NULL DEFAULT 0,

    -- Premio
    prize_name              TEXT NOT NULL,
    prize_image             TEXT,
    prize_value             TEXT,
    prize_details           TEXT[],

    -- Fechas
    start_date              TIMESTAMPTZ NOT NULL,
    end_date                TIMESTAMPTZ NOT NULL,
    draw_date               TIMESTAMPTZ NOT NULL,

    -- Extras
    rules                   TEXT[],
    requirements            JSONB,

    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -------------------------------------------------------
-- TABLA: social_actions
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS social_actions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    giveaway_id         UUID NOT NULL REFERENCES giveaways(id) ON DELETE CASCADE,
    platform            social_platform     NOT NULL,
    title               TEXT                NOT NULL,
    description         TEXT,
    url                 TEXT                NOT NULL,
    bonus_participations INTEGER            NOT NULL DEFAULT 1,
    action_type         social_action_type  NOT NULL
);

-- -------------------------------------------------------
-- TABLA: participants
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS participants (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    giveaway_id                 UUID NOT NULL REFERENCES giveaways(id) ON DELETE CASCADE,

    -- Datos personales (dni se almacena encriptado en la app antes de insertar)
    full_name                   TEXT NOT NULL,
    email                       TEXT NOT NULL,
    phone                       TEXT,
    dni                         TEXT NOT NULL,   -- AES-GCM encrypted
    birth_date                  DATE,

    -- Referidos
    referral_code               VARCHAR(10) UNIQUE NOT NULL,
    referred_by                 VARCHAR(10),

    -- Contadores de participación
    paid_tickets                INTEGER NOT NULL DEFAULT 0,
    paid_participations         INTEGER NOT NULL DEFAULT 0,
    referral_count              INTEGER NOT NULL DEFAULT 0,
    referral_participations     INTEGER NOT NULL DEFAULT 0,
    social_participations       INTEGER NOT NULL DEFAULT 0,
    total_participations        INTEGER NOT NULL DEFAULT 0,

    -- Tickets asignados — ['FORT0010001', 'FORT0010002', ...]
    ticket_numbers              TEXT[] NOT NULL DEFAULT '{}',

    -- Redes sociales
    social_handles              JSONB,
    completed_social_action_ids TEXT[] NOT NULL DEFAULT '{}',

    registered_at               TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Un participante no puede registrarse dos veces en el mismo sorteo con el mismo email o dni
    UNIQUE (giveaway_id, email),
    UNIQUE (giveaway_id, dni)
);

-- -------------------------------------------------------
-- TABLA: winners
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS winners (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    giveaway_id         UUID NOT NULL REFERENCES giveaways(id) ON DELETE CASCADE,
    participant_id      UUID REFERENCES participants(id) ON DELETE SET NULL,
    name                TEXT NOT NULL,
    dni_masked          VARCHAR(12),
    total_participations INTEGER,
    ticket_number       VARCHAR(15) NOT NULL,
    social_handle       TEXT,
    announced_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_backup           BOOLEAN NOT NULL DEFAULT false
);

-- -------------------------------------------------------
-- ÍNDICES para rendimiento
-- -------------------------------------------------------
CREATE INDEX idx_giveaways_status    ON giveaways(status);
CREATE INDEX idx_giveaways_slug      ON giveaways(slug);
CREATE INDEX idx_participants_giveaway ON participants(giveaway_id);
CREATE INDEX idx_participants_referral ON participants(referral_code);
CREATE INDEX idx_participants_email  ON participants(giveaway_id, email);
CREATE INDEX idx_social_actions_giveaway ON social_actions(giveaway_id);
CREATE INDEX idx_winners_giveaway    ON winners(giveaway_id);

-- -------------------------------------------------------
-- TRIGGER: auto-actualizar updated_at en giveaways
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER giveaways_updated_at
    BEFORE UPDATE ON giveaways
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
