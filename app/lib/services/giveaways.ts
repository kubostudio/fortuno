import { Giveaway } from "../types/giveaway";

// ---------------------------------------------------------------------------
// Helpers puros de numeración de tickets y referidos
// ---------------------------------------------------------------------------

/**
 * Genera números de ticket con formato FORT{sorteo3d}{seq4d}.
 * @param sorteoNumber  Número correlativo del sorteo (ej. 1 → "001")
 * @param startSeq      Primer número de secuencia a usar (inclusive)
 * @param count         Cuántos tickets generar
 * @returns string[]    Ej. ['FORT0010001', 'FORT0010002']
 */
export function buildTicketNumbers(sorteoNumber: number, startSeq: number, count: number): string[] {
    const sn = String(sorteoNumber).padStart(3, "0");
    return Array.from({ length: count }, (_, i) => {
        const seq = String(startSeq + i).padStart(4, "0");
        return `FORT${sn}${seq}`;
    });
}

/**
 * Genera un código de referido alfanumérico único para el participante.
 */
export function generateReferralCode(name: string): string {
    const cleanName = name.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 3) || "FTN";
    const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${cleanName}${randomChars}`;
}

// ---------------------------------------------------------------------------
// Sorteos iniciales (Fallback estático sincronizado con la BD de Supabase)
// ---------------------------------------------------------------------------

export const INITIAL_GIVEAWAYS: Giveaway[] = [
    {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        slug: "sorteo-playstation-5-slim",
        title: "PlayStation 5 Slim + EA Sports FC 26",
        subtitle: "Gánate la consola de última generación con 1TB de almacenamiento y dos controles DualSense.",
        description: "Participa en el sorteo oficial de Fortuno 2.0 por una consola PlayStation 5 Slim Edición Digital con dos mandos DualSense inalámbricos y el juego EA Sports FC 26.",
        prize: {
            name: "PlayStation 5 Slim Digital 1TB + 2 Mandos + FC 26",
            image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80",
            value: "$650 USD",
            details: [
                "Consola PS5 Slim 1TB SSD ultra rápido",
                "2 Controles inalámbricos DualSense (Blanco y Midnight Black)",
                "Juego Digital EA Sports FC 26",
                "Envío internacional asegurado incluido"
            ]
        },
        startDate: "2026-08-01T00:00:00Z",
        endDate: "2026-09-15T23:59:59Z",
        drawDate: "2026-09-16T19:00:00Z",
        status: "active",
        sorteoNumber: 1,
        ticketPrice: 5,
        currency: "USD",
        maxParticipants: 500,
        maxTickets: 1500,
        ticketsSold: 21,
        nextTicketSeq: 22,
        totalParticipantsCount: 4,
        socialActions: [
            {
                id: "act-ig-follow",
                platform: "instagram",
                title: "Seguir a @FortunoApp en Instagram",
                description: "Sigue nuestra cuenta oficial para noticias, anuncios y códigos de bonificación.",
                url: "https://instagram.com",
                bonusParticipations: 1,
                actionType: "follow"
            },
            {
                id: "act-tt-follow",
                platform: "tiktok",
                title: "Seguir en TikTok @FortunoOficial",
                description: "Mira los clips de los sorteos y transmisiones en vivo.",
                url: "https://tiktok.com",
                bonusParticipations: 1,
                actionType: "follow"
            },
            {
                id: "act-yt-sub",
                platform: "youtube",
                title: "Suscribirse al canal de YouTube",
                description: "Transmisiones en vivo de todos los sorteos con verificación en directo.",
                url: "https://youtube.com",
                bonusParticipations: 2,
                actionType: "subscribe"
            },
            {
                id: "act-x-follow",
                platform: "x",
                title: "Seguir en X (Twitter)",
                description: "Entérate al instante de nuevos ganadores y alertas de sorteos.",
                url: "https://x.com",
                bonusParticipations: 1,
                actionType: "follow"
            }
        ],
        rules: [
            "El participante debe registrar su nombre completo, DNI y correo electrónico real.",
            "Cada ticket adquirido otorga 3 participaciones automáticas en el sorteo.",
            "Por cada 3 amigos referidos que se registren, obtienes 1 participación adicional.",
            "El sorteo se realizará en vivo mediante la plataforma de Fortuno el 16 de Septiembre a las 19:00 hrs.",
            "El ganador tendrá 48 horas para responder y confirmar sus datos de entrega."
        ],
        requirements: { minAge: 18, mustBeFollower: true }
    },
    {
        id: "b1ffcd00-0d1c-4f09-cc7e-7cc0ce491b22",
        slug: "sorteo-iphone-16-pro-max",
        title: "iPhone 16 Pro Max 256GB Titanio",
        subtitle: "El smartphone más potente con pantalla Super Retina XDR y cámara de 48 MP.",
        description: "Gánate el nuevo iPhone 16 Pro Max de 256GB en acabado Titanio Natural.",
        prize: {
            name: "Apple iPhone 16 Pro Max 256GB Titanio Natural",
            image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80",
            value: "$1,299 USD",
            details: [
                "iPhone 16 Pro Max 256 GB Nuevo y Sellado",
                "Color Titanio Natural (Libre de fábrica)",
                "Cargador MagSafe y Case Oficial de Regalo",
                "Garantía oficial Apple Care 1 año"
            ]
        },
        startDate: "2026-08-10T00:00:00Z",
        endDate: "2026-09-30T23:59:59Z",
        drawDate: "2026-10-01T20:00:00Z",
        status: "active",
        sorteoNumber: 2,
        ticketPrice: 10,
        currency: "USD",
        maxParticipants: 1000,
        maxTickets: 3000,
        ticketsSold: 10,
        nextTicketSeq: 11,
        totalParticipantsCount: 3,
        socialActions: [
            {
                id: "act-ig-iphone",
                platform: "instagram",
                title: "Seguir a @FortunoApp en Instagram",
                description: "Sigue la cuenta oficial de Instagram",
                url: "https://instagram.com",
                bonusParticipations: 1,
                actionType: "follow"
            },
            {
                id: "act-yt-iphone",
                platform: "youtube",
                title: "Suscribirse a YouTube Fortuno Live",
                description: "No te pierdas la transmisión en directo del sorteo",
                url: "https://youtube.com",
                bonusParticipations: 2,
                actionType: "subscribe"
            }
        ],
        rules: [
            "Abierto a participantes mayores de 18 años.",
            "Cada ticket de $10 USD equivale a 3 participaciones.",
            "Invita 3 amigos para ganar 1 participación gratis.",
            "Validación obligatoria de DNI al momento de anunciar al ganador."
        ],
        requirements: { minAge: 18, mustBeFollower: true }
    },
    {
        id: "c2aabd11-1e2d-4010-dd8f-8dd1df5a2c33",
        slug: "sorteo-nintendo-switch-oled",
        title: "Nintendo Switch OLED + Mario Kart World Tour",
        subtitle: "Sorteo completado con transmisión en vivo y verificación de ganadores.",
        description: "Sorteo finalizado con éxito el mes anterior.",
        prize: {
            name: "Nintendo Switch Modelo OLED Edición Especial Mario",
            image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=1200&q=80",
            value: "$380 USD",
            details: ["Nintendo Switch OLED", "Mario Kart 8 Deluxe", "Funda de viaje oficial"]
        },
        startDate: "2026-06-01T00:00:00Z",
        endDate: "2026-07-15T23:59:59Z",
        drawDate: "2026-07-16T19:00:00Z",
        status: "completed",
        sorteoNumber: 3,
        ticketPrice: 3,
        currency: "USD",
        maxParticipants: 300,
        maxTickets: 1000,
        ticketsSold: 640,
        nextTicketSeq: 641,
        totalParticipantsCount: 280,
        socialActions: [],
        winner: {
            id: "part-win-01",
            name: "Carlos Mendoza R.",
            dniMasked: "7482****",
            totalParticipations: 12,
            ticketNumber: "FORT0030829",
            announcedAt: "2026-07-16T19:15:30Z",
            socialHandle: "@carlos_mza"
        },
        backupWinners: [
            {
                id: "part-bak-01",
                name: "Sofía Valentina L.",
                dniMasked: "4920****",
                totalParticipations: 6,
                ticketNumber: "FORT0031023",
                announcedAt: "2026-07-16T19:15:30Z"
            }
        ]
    }
];
