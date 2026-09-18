export type GiveawayStatus = 'active' | 'upcoming' | 'completed' | 'paused';

export interface SocialAction {
    id: string;
    platform: 'instagram' | 'tiktok' | 'youtube' | 'x' | 'facebook';
    title: string;
    description: string;
    url: string;
    bonusParticipations: number;
    actionType: 'follow' | 'subscribe' | 'share';
}

export interface GiveawayWinner {
    id: string;
    name: string;
    dniMasked: string; // ej. 1234****
    totalParticipations: number;
    ticketNumber: string; // Número de ticket ganador FORT001XXXX
    announcedAt: string;
    socialHandle?: string;
}

export interface Giveaway {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    description: string;
    prize: {
        name: string;
        image: string;
        value?: string;
        details?: string[];
    };
    startDate: string;
    endDate: string;
    drawDate: string;
    status: GiveawayStatus;

    // Número correlativo del sorteo para formato FORT{num}XXXX
    sorteoNumber: number;

    // Configuración de Tickets & Cupos
    ticketPrice: number; // Precio por ticket
    currency: string; // ej. USD, PEN, EUR
    maxParticipants?: number; // Cupo máximo de participantes (opcional, oculto por default)
    maxTickets?: number; // Límite total de tickets disponibles
    ticketsSold: number; // Cantidad de tickets comprados
    nextTicketSeq: number; // Próximo número de ticket a asignar (para correlativo)
    totalParticipantsCount: number; // Participantes únicos registrados

    // Reglas de negocio:
    // 1 ticket = 3 participaciones
    // 3 referidos = 1 participación
    socialActions: SocialAction[];
    winner?: GiveawayWinner;
    backupWinners?: GiveawayWinner[];
    rules?: string[];
    requirements?: {
        minAge?: number;
        country?: string;
        mustBeFollower?: boolean;
    };
}

export interface Participant {
    id: string;
    giveawayId: string;
    fullName: string;
    email: string;
    phone?: string; // Teléfono / WhatsApp para envío de tickets
    dni: string;
    birthDate: string;
    referralCode: string;
    referredBy?: string;

    // Sistema de tickets y participaciones
    paidTickets: number; // Tickets comprados
    paidParticipations: number; // paidTickets * 3
    referralCount: number; // Cantidad de personas registradas con su código
    referralParticipations: number; // Math.floor(referralCount / 3)
    socialParticipations: number; // Participaciones por redes sociales
    totalParticipations: number; // Total acumulado para la tómbola

    // Números de ticket asignados — formato FORT{sorteoNum}{seq}
    // Ejemplo: ['FORT0010001', 'FORT0010002']
    ticketNumbers: string[];

    socialHandles?: Record<string, string>;
    completedSocialActionIds: string[];
    registeredAt: string;
}

export interface RegistrationPayload {
    giveawayId: string;
    fullName: string;
    email: string;
    phone?: string;
    dni: string;
    birthDate: string;
    referralCode?: string;
    initialTickets?: number;
}

export interface RegistrationResult {
    success: boolean;
    participant?: Participant;
    message?: string;
    isExisting?: boolean;
}
