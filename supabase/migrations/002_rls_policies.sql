-- ============================================================
-- Fortuno — Migración 002: Row Level Security (RLS)
-- Ejecutar DESPUÉS de 001_initial_schema.sql
-- ============================================================

-- -------------------------------------------------------
-- Habilitar RLS en todas las tablas
-- -------------------------------------------------------
ALTER TABLE giveaways       ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_actions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants    ENABLE ROW LEVEL SECURITY;
ALTER TABLE winners         ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------
-- GIVEAWAYS: lectura pública, escritura solo service role
-- -------------------------------------------------------
CREATE POLICY "giveaways_select_public"
    ON giveaways FOR SELECT
    USING (true);  -- cualquiera puede leer sorteos

-- La escritura se maneja solo desde Server Actions con service role key
-- que bypassea RLS automáticamente.

-- -------------------------------------------------------
-- SOCIAL_ACTIONS: lectura pública
-- -------------------------------------------------------
CREATE POLICY "social_actions_select_public"
    ON social_actions FOR SELECT
    USING (true);

-- -------------------------------------------------------
-- PARTICIPANTS: solo lectura con service role (datos sensibles)
-- El cliente nunca lee participants directamente.
-- Toda lectura se hace desde Server Actions.
-- -------------------------------------------------------
-- No policies para anon: los participantes solo se acceden server-side

-- -------------------------------------------------------
-- WINNERS: lectura pública (se muestran en la página de ganadores)
-- -------------------------------------------------------
CREATE POLICY "winners_select_public"
    ON winners FOR SELECT
    USING (true);
