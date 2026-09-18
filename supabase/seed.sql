-- ============================================================
-- Fortuno — Seed de datos de prueba
-- Ejecutar DESPUÉS de 001 y 002.
-- ============================================================

-- -------------------------------------------------------
-- SORTEOS (replica exacta de INITIAL_GIVEAWAYS)
-- -------------------------------------------------------
INSERT INTO giveaways (
    id, slug, title, subtitle, description,
    sorteo_number, status,
    ticket_price, currency,
    max_participants, max_tickets, tickets_sold, next_ticket_seq, total_participants_count,
    prize_name, prize_image, prize_value, prize_details,
    start_date, end_date, draw_date,
    rules, requirements
) VALUES
(
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'sorteo-playstation-5-slim',
    'PlayStation 5 Slim + EA Sports FC 26',
    'Gánate la consola de última generación con 1TB de almacenamiento y dos controles DualSense.',
    'Participa en el sorteo oficial de Fortuno 2.0 por una consola PlayStation 5 Slim Edición Digital con dos mandos DualSense inalámbricos y el juego EA Sports FC 26.',
    1, 'active',
    5.00, 'USD',
    500, 1500, 420, 421, 230,
    'PlayStation 5 Slim Digital 1TB + 2 Mandos + FC 26',
    'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80',
    '$650 USD',
    ARRAY['Consola PS5 Slim 1TB SSD ultra rápido', '2 Controles inalámbricos DualSense (Blanco y Midnight Black)', 'Juego Digital EA Sports FC 26', 'Envío internacional asegurado incluido'],
    '2026-08-01T00:00:00Z', '2026-09-15T23:59:59Z', '2026-09-16T19:00:00Z',
    ARRAY[
        'El participante debe registrar su nombre completo, DNI y correo electrónico real.',
        'Cada ticket adquirido otorga 3 participaciones automáticas en el sorteo.',
        'Por cada 3 amigos referidos que se registren, obtienes 1 participación adicional.',
        'El sorteo se realizará en vivo mediante la plataforma de Fortuno el 16 de Septiembre a las 19:00 hrs.',
        'El ganador tendrá 48 horas para responder y confirmar sus datos de entrega.'
    ],
    '{"minAge": 18, "mustBeFollower": true}'
),
(
    'b1ffcd00-0d1c-4f09-cc7e-7cc0ce491b22',
    'sorteo-iphone-16-pro-max',
    'iPhone 16 Pro Max 256GB Titanio',
    'El smartphone más potente con pantalla Super Retina XDR y cámara de 48 MP.',
    'Gánate el nuevo iPhone 16 Pro Max de 256GB en acabado Titanio Natural.',
    2, 'active',
    10.00, 'USD',
    1000, 3000, 890, 891, 460,
    'Apple iPhone 16 Pro Max 256GB Titanio Natural',
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80',
    '$1,299 USD',
    ARRAY['iPhone 16 Pro Max 256 GB Nuevo y Sellado', 'Color Titanio Natural (Libre de fábrica)', 'Cargador MagSafe y Case Oficial de Regalo', 'Garantía oficial Apple Care 1 año'],
    '2026-08-10T00:00:00Z', '2026-09-30T23:59:59Z', '2026-10-01T20:00:00Z',
    ARRAY[
        'Abierto a participantes mayores de 18 años.',
        'Cada ticket de $10 USD equivale a 3 participaciones.',
        'Invita 3 amigos para ganar 1 participación gratis.',
        'Validación obligatoria de DNI al momento de anunciar al ganador.'
    ],
    '{"minAge": 18, "mustBeFollower": true}'
),
(
    'c2aabd11-1e2d-4010-dd8f-8dd1df5a2c33',
    'sorteo-nintendo-switch-oled',
    'Nintendo Switch OLED + Mario Kart World Tour',
    'Sorteo completado con transmisión en vivo y verificación de ganadores.',
    'Sorteo finalizado con éxito el mes anterior.',
    3, 'completed',
    3.00, 'USD',
    300, 1000, 640, 641, 280,
    'Nintendo Switch Modelo OLED Edición Especial Mario',
    'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=1200&q=80',
    '$380 USD',
    ARRAY['Nintendo Switch OLED', 'Mario Kart 8 Deluxe', 'Funda de viaje oficial'],
    '2026-06-01T00:00:00Z', '2026-07-15T23:59:59Z', '2026-07-16T19:00:00Z',
    NULL,
    NULL
);

-- -------------------------------------------------------
-- ACCIONES SOCIALES: Sorteo PS5
-- -------------------------------------------------------
INSERT INTO social_actions (id, giveaway_id, platform, title, description, url, bonus_participations, action_type) VALUES
(
    gen_random_uuid(),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'instagram', 'Seguir a @FortunoApp en Instagram',
    'Sigue nuestra cuenta oficial para noticias, anuncios y códigos de bonificación.',
    'https://instagram.com', 1, 'follow'
),
(
    gen_random_uuid(),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'tiktok', 'Seguir en TikTok @FortunoOficial',
    'Mira los clips de los sorteos y transmisiones en vivo.',
    'https://tiktok.com', 1, 'follow'
),
(
    gen_random_uuid(),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'youtube', 'Suscribirse al canal de YouTube',
    'Transmisiones en vivo de todos los sorteos con verificación en directo.',
    'https://youtube.com', 2, 'subscribe'
),
(
    gen_random_uuid(),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'x', 'Seguir en X (Twitter)',
    'Entérate al instante de nuevos ganadores y alertas de sorteos.',
    'https://x.com', 1, 'follow'
);

-- -------------------------------------------------------
-- ACCIONES SOCIALES: Sorteo iPhone
-- -------------------------------------------------------
INSERT INTO social_actions (id, giveaway_id, platform, title, description, url, bonus_participations, action_type) VALUES
(
    gen_random_uuid(),
    'b1ffcd00-0d1c-4f09-cc7e-7cc0ce491b22',
    'instagram', 'Seguir a @FortunoApp en Instagram',
    'Sigue la cuenta oficial de Instagram',
    'https://instagram.com', 1, 'follow'
),
(
    gen_random_uuid(),
    'b1ffcd00-0d1c-4f09-cc7e-7cc0ce491b22',
    'youtube', 'Suscribirse a YouTube Fortuno Live',
    'No te pierdas la transmisión en directo del sorteo',
    'https://youtube.com', 2, 'subscribe'
);

-- -------------------------------------------------------
-- GANADOR: Sorteo Nintendo Switch
-- -------------------------------------------------------
INSERT INTO winners (id, giveaway_id, participant_id, name, dni_masked, total_participations, ticket_number, social_handle, announced_at, is_backup)
VALUES
(
    gen_random_uuid(),
    'c2aabd11-1e2d-4010-dd8f-8dd1df5a2c33',
    NULL,
    'Carlos Mendoza R.',
    '7482****',
    12,
    'FORT0030829',
    '@carlos_mza',
    '2026-07-16T19:15:30Z',
    false
),
(
    gen_random_uuid(),
    'c2aabd11-1e2d-4010-dd8f-8dd1df5a2c33',
    NULL,
    'Sofía Valentina L.',
    '4920****',
    6,
    'FORT0031023',
    NULL,
    '2026-07-16T19:15:30Z',
    true
);

-- -------------------------------------------------------
-- PARTICIPANTES MOCK (datos de prueba, DNI no real)
-- Nota: En producción, el DNI siempre llega encriptado desde la app.
-- Aquí usamos valores ficticios para demostración.
-- -------------------------------------------------------
INSERT INTO participants (
    id, giveaway_id, full_name, email, phone, dni, birth_date,
    referral_code, referred_by,
    paid_tickets, paid_participations, referral_count, referral_participations,
    social_participations, total_participations,
    ticket_numbers, completed_social_action_ids, registered_at
) VALUES
-- Participantes en el sorteo PS5
(
    gen_random_uuid(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Alejandro Morales Vega', 'alejandro.morales.vega@gmail.com', NULL,
    '72194821', '1998-05-14',
    'ALEV42', NULL,
    4, 12, 6, 2, 0, 14,
    ARRAY['FORT0010001','FORT0010002','FORT0010003','FORT0010004'],
    '{}', '2026-08-10T12:00:00Z'
),
(
    gen_random_uuid(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Camila Andrea Vega Torres', 'camila.andrea.vega.torres@gmail.com', NULL,
    '48201948', '1995-03-22',
    'CAMV93', NULL,
    6, 18, 9, 3, 0, 21,
    ARRAY['FORT0010005','FORT0010006','FORT0010007','FORT0010008','FORT0010009','FORT0010010'],
    '{}', '2026-08-11T09:30:00Z'
),
(
    gen_random_uuid(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Valentina Sofía Gómez Pérez', 'valentina.sofia.gomez.perez@gmail.com', NULL,
    '80192837', '2001-11-07',
    'VALG17', NULL,
    3, 9, 0, 0, 0, 9,
    ARRAY['FORT0010011','FORT0010012','FORT0010013'],
    '{}', '2026-08-12T15:00:00Z'
),
(
    gen_random_uuid(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Lucía Florencia Martínez Soto', 'lucia.florencia.martinez.soto@gmail.com', NULL,
    '71029384', '1993-07-18',
    'LUCM88', NULL,
    8, 24, 12, 4, 0, 28,
    ARRAY['FORT0010014','FORT0010015','FORT0010016','FORT0010017','FORT0010018','FORT0010019','FORT0010020','FORT0010021'],
    '{}', '2026-08-13T10:00:00Z'
),
-- Participantes en el sorteo iPhone
(
    gen_random_uuid(), 'b1ffcd00-0d1c-4f09-cc7e-7cc0ce491b22',
    'Mariana Isabel Silva Ramos', 'mariana.isabel.silva.ramos@gmail.com', NULL,
    '73910284', '1997-02-14',
    'MARS31', NULL,
    5, 15, 0, 0, 0, 15,
    ARRAY['FORT0020001','FORT0020002','FORT0020003','FORT0020004','FORT0020005'],
    '{}', '2026-08-15T08:00:00Z'
),
(
    gen_random_uuid(), 'b1ffcd00-0d1c-4f09-cc7e-7cc0ce491b22',
    'Nicolás Andrés Paredes Flores', 'nicolas.andres.paredes.flores@gmail.com', NULL,
    '42019283', '1999-09-30',
    'NICF56', NULL,
    4, 12, 3, 1, 0, 13,
    ARRAY['FORT0020006','FORT0020007','FORT0020008','FORT0020009'],
    '{}', '2026-08-16T11:00:00Z'
),
(
    gen_random_uuid(), 'b1ffcd00-0d1c-4f09-cc7e-7cc0ce491b22',
    'Paula Daniela Herrera Cruz', 'paula.daniela.herrera.cruz@gmail.com', NULL,
    '79102938', '2000-04-05',
    'PAUH74', NULL,
    1, 3, 0, 0, 0, 3,
    ARRAY['FORT0020010'],
    '{}', '2026-08-17T14:30:00Z'
);
