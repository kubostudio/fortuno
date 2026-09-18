import { createServerClient } from "../supabase/server";
import { createClient } from "../supabase/client";
import type { Database } from "../supabase/types";
import { Giveaway, Participant, SocialAction, GiveawayWinner } from "../types/giveaway";

type GiveawayRow = Database["public"]["Tables"]["giveaways"]["Row"];
type SocialActionRow = Database["public"]["Tables"]["social_actions"]["Row"];
type WinnerRow = Database["public"]["Tables"]["winners"]["Row"];
type ParticipantRow = Database["public"]["Tables"]["participants"]["Row"];

// ---------------------------------------------------------------------------
// Helpers de mapeo BD → Tipos de la app
// ---------------------------------------------------------------------------

function mapSocialActionFromDB(row: {
    id: string;
    platform: string;
    title: string;
    description: string | null;
    url: string;
    bonus_participations: number;
    action_type: string;
}): SocialAction {
    return {
        id: row.id,
        platform: row.platform as SocialAction["platform"],
        title: row.title,
        description: row.description ?? "",
        url: row.url,
        bonusParticipations: row.bonus_participations,
        actionType: row.action_type as SocialAction["actionType"],
    };
}

function mapWinnerFromDB(row: {
    id: string;
    name: string;
    dni_masked: string | null;
    total_participations: number | null;
    ticket_number: string;
    announced_at: string;
    social_handle: string | null;
}): GiveawayWinner {
    return {
        id: row.id,
        name: row.name,
        dniMasked: row.dni_masked ?? "",
        totalParticipations: row.total_participations ?? 0,
        ticketNumber: row.ticket_number,
        announcedAt: row.announced_at,
        socialHandle: row.social_handle ?? undefined,
    };
}

function mapGiveawayFromDB(
    row: Record<string, unknown>,
    socialActions: SocialAction[],
    winner?: GiveawayWinner,
    backupWinners?: GiveawayWinner[]
): Giveaway {
    return {
        id: row.id as string,
        slug: row.slug as string,
        title: row.title as string,
        subtitle: (row.subtitle as string) ?? "",
        description: (row.description as string) ?? "",
        prize: {
            name: row.prize_name as string,
            image: (row.prize_image as string) ?? "",
            value: (row.prize_value as string) ?? undefined,
            details: (row.prize_details as string[]) ?? undefined,
        },
        startDate: row.start_date as string,
        endDate: row.end_date as string,
        drawDate: row.draw_date as string,
        status: row.status as Giveaway["status"],
        sorteoNumber: row.sorteo_number as number,
        ticketPrice: Number(row.ticket_price),
        currency: row.currency as string,
        maxParticipants: (row.max_participants as number) ?? undefined,
        maxTickets: (row.max_tickets as number) ?? undefined,
        ticketsSold: row.tickets_sold as number,
        nextTicketSeq: row.next_ticket_seq as number,
        totalParticipantsCount: row.total_participants_count as number,
        socialActions,
        winner,
        backupWinners: backupWinners && backupWinners.length > 0 ? backupWinners : undefined,
        rules: (row.rules as string[]) ?? undefined,
        requirements: (row.requirements as Giveaway["requirements"]) ?? undefined,
    };
}

function mapParticipantFromDB(row: Record<string, unknown>): Participant {
    return {
        id: row.id as string,
        giveawayId: row.giveaway_id as string,
        fullName: row.full_name as string,
        email: row.email as string,
        phone: (row.phone as string) ?? undefined,
        dni: row.dni as string,
        birthDate: (row.birth_date as string) ?? "",
        referralCode: row.referral_code as string,
        referredBy: (row.referred_by as string) ?? undefined,
        paidTickets: row.paid_tickets as number,
        paidParticipations: row.paid_participations as number,
        referralCount: row.referral_count as number,
        referralParticipations: row.referral_participations as number,
        socialParticipations: row.social_participations as number,
        totalParticipations: row.total_participations as number,
        ticketNumbers: (row.ticket_numbers as string[]) ?? [],
        socialHandles: (row.social_handles as Record<string, string>) ?? undefined,
        completedSocialActionIds: (row.completed_social_action_ids as string[]) ?? [],
        registeredAt: row.registered_at as string,
    };
}

// ---------------------------------------------------------------------------
// Servicio de Giveaways — Supabase (lectura pública con anon key)
// ---------------------------------------------------------------------------

/**
 * Obtiene todos los sorteos con sus acciones sociales y ganadores.
 * Usa el cliente público (browser) — apto para Server Components y Client Components.
 */
export async function getGiveawaysFromDB(): Promise<Giveaway[]> {
    const supabase = typeof window === "undefined" && process.env.SUPABASE_SERVICE_ROLE_KEY
        ? createServerClient()
        : createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;

    const { data: giveawayRowsRaw, error } = await sb
        .from("giveaways")
        .select("*")
        .order("sorteo_number", { ascending: false });

    if (error || !giveawayRowsRaw) {
        console.error("[getGiveawaysFromDB] Error:", error?.message);
        return [];
    }
    const giveawayRows = giveawayRowsRaw as GiveawayRow[];

    // Cargar acciones sociales, ganadores y participantes en paralelo
    const [actionsResult, winnersResult, participantsResult] = await Promise.allSettled([
        sb.from("social_actions").select("*"),
        sb.from("winners").select("*"),
        sb.from("participants").select("giveaway_id, paid_tickets, ticket_numbers"),
    ]);

    const allActions: SocialActionRow[] = actionsResult.status === "fulfilled" ? (actionsResult.value.data ?? []) : [];
    const allWinners: WinnerRow[] = winnersResult.status === "fulfilled" ? (winnersResult.value.data ?? []) : [];
    const allParticipants = participantsResult.status === "fulfilled" ? (participantsResult.value.data ?? []) : [];

    return giveawayRows.map((row) => {
        const actions = allActions
            .filter((a) => a.giveaway_id === row.id)
            .map(mapSocialActionFromDB);

        const giveawayWinners = allWinners
            .filter((w) => w.giveaway_id === row.id)
            .sort((a, b) => new Date(b.announced_at).getTime() - new Date(a.announced_at).getTime());
        const primaryWinner = giveawayWinners.find((w) => !w.is_backup);
        const backupWinnersData = giveawayWinners.filter((w) => w.is_backup).slice(0, 3);

        const gParticipants = allParticipants.filter((p: any) => p.giveaway_id === row.id);
        const hasLiveParticipants = gParticipants.length > 0;
        const realTicketsSold = hasLiveParticipants
            ? gParticipants.reduce((sum: number, p: any) => {
                const countFromTickets = Array.isArray(p.ticket_numbers) ? p.ticket_numbers.length : 0;
                const countFromPaid = Number(p.paid_tickets) || 0;
                return sum + Math.max(countFromTickets, countFromPaid);
            }, 0)
            : (row.tickets_sold as number);
        const realParticipantsCount = hasLiveParticipants
            ? gParticipants.length
            : (row.total_participants_count as number);

        return mapGiveawayFromDB(
            {
                ...row,
                tickets_sold: realTicketsSold,
                total_participants_count: realParticipantsCount,
            },
            actions,
            primaryWinner ? mapWinnerFromDB(primaryWinner) : undefined,
            backupWinnersData.length > 0 ? backupWinnersData.map(mapWinnerFromDB) : undefined
        );
    });
}

/**
 * Obtiene un sorteo por slug.
 */
export async function getGiveawayBySlugFromDB(slug: string): Promise<Giveaway | null> {
    const supabase = typeof window === "undefined" && process.env.SUPABASE_SERVICE_ROLE_KEY
        ? createServerClient()
        : createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;

    const { data: rowRaw, error } = await sb
        .from("giveaways")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error || !rowRaw) return null;
    const row = rowRaw as GiveawayRow;

    const [actionsRes, winnersRes, participantsRes] = await Promise.allSettled([
        sb.from("social_actions").select("*").eq("giveaway_id", row.id),
        sb.from("winners").select("*").eq("giveaway_id", row.id).order("announced_at", { ascending: false }),
        sb.from("participants").select("giveaway_id, paid_tickets, ticket_numbers").eq("giveaway_id", row.id),
    ]);

    const actions: SocialActionRow[] = actionsRes.status === "fulfilled"
        ? (actionsRes.value.data ?? [])
        : [];
    const allWinners: WinnerRow[] = winnersRes.status === "fulfilled"
        ? ((winnersRes.value.data ?? []) as WinnerRow[]).sort(
            (a, b) => new Date(b.announced_at).getTime() - new Date(a.announced_at).getTime()
        )
        : [];
    const primaryWinner = allWinners.find((w) => !w.is_backup);
    const backupWinnersData = allWinners.filter((w) => w.is_backup).slice(0, 3);

    const gParticipants = participantsRes.status === "fulfilled" ? (participantsRes.value.data ?? []) : [];
    const hasLiveParticipants = gParticipants.length > 0;
    const realTicketsSold = hasLiveParticipants
        ? gParticipants.reduce((sum: number, p: any) => {
            const countFromTickets = Array.isArray(p.ticket_numbers) ? p.ticket_numbers.length : 0;
            const countFromPaid = Number(p.paid_tickets) || 0;
            return sum + Math.max(countFromTickets, countFromPaid);
        }, 0)
        : (row.tickets_sold as number);
    const realParticipantsCount = hasLiveParticipants
        ? gParticipants.length
        : (row.total_participants_count as number);

    return mapGiveawayFromDB(
        {
            ...row,
            tickets_sold: realTicketsSold,
            total_participants_count: realParticipantsCount,
        },
        actions.map(mapSocialActionFromDB),
        primaryWinner ? mapWinnerFromDB(primaryWinner) : undefined,
        backupWinnersData.length > 0 ? backupWinnersData.map(mapWinnerFromDB) : undefined
    );
}

// ---------------------------------------------------------------------------
// Servicio de Participantes — solo server-side (service role)
// ---------------------------------------------------------------------------

/**
 * Obtiene los participantes de un sorteo. Solo usar en Server Actions.
 */
export async function getParticipantsByGiveawayServer(giveawayId: string): Promise<Participant[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = createServerClient() as any;
    const { data, error } = await sb
        .from("participants")
        .select("*")
        .eq("giveaway_id", giveawayId)
        .order("total_participations", { ascending: false });

    if (error || !data) return [];
    return (data as ParticipantRow[]).map((row) => mapParticipantFromDB(row as Record<string, unknown>));
}

/**
 * Busca un participante por email o DNI en un sorteo. Solo server-side.
 */
export async function findParticipantServer(
    giveawayId: string,
    email?: string,
    dni?: string
): Promise<Participant | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = createServerClient() as any;

    if (email) {
        const { data } = await sb
            .from("participants")
            .select("*")
            .eq("giveaway_id", giveawayId)
            .eq("email", email.toLowerCase().trim())
            .single();
        if (data) return mapParticipantFromDB((data as ParticipantRow) as Record<string, unknown>);
    }

    if (dni) {
        const { data } = await sb
            .from("participants")
            .select("*")
            .eq("giveaway_id", giveawayId)
            .eq("dni", dni.trim())
            .single();
        if (data) return mapParticipantFromDB((data as ParticipantRow) as Record<string, unknown>);
    }

    return null;
}

/**
 * Actualiza un participante (contadores de referidos, redes sociales, etc.). Solo server-side.
 */
export async function updateParticipantServer(
    participantId: string,
    updates: Partial<{
        paid_tickets: number;
        paid_participations: number;
        referral_count: number;
        referral_participations: number;
        social_participations: number;
        total_participations: number;
        ticket_numbers: string[];
        social_handles: Record<string, string>;
        completed_social_action_ids: string[];
        phone: string;
    }>
): Promise<Participant | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = createServerClient() as any;
    const { data, error } = await sb
        .from("participants")
        .update(updates)
        .eq("id", participantId)
        .select()
        .single();

    if (error || !data) {
        console.error("[updateParticipantServer]", error?.message);
        return null;
    }
    return mapParticipantFromDB((data as ParticipantRow) as Record<string, unknown>);
}

/**
 * Actualiza contadores del sorteo (tickets_sold, next_ticket_seq, total_participants_count). Solo server-side.
 */
export async function updateGiveawayCountersServer(
    giveawayId: string,
    updates: Partial<{
        tickets_sold: number;
        next_ticket_seq: number;
        total_participants_count: number;
    }>
): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = createServerClient() as any;
    const { error } = await sb
        .from("giveaways")
        .update(updates)
        .eq("id", giveawayId);

    if (error) console.error("[updateGiveawayCountersServer]", error.message);
}

/**
 * Obtiene un sorteo por ID desde la BD.
 */
export async function getGiveawayByIdFromDB(id: string): Promise<Giveaway | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = createServerClient() as any;

    const { data: rowRaw, error } = await sb
        .from("giveaways")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !rowRaw) return null;
    const row = rowRaw as GiveawayRow;

    const [actionsRes, winnersRes, participantsRes] = await Promise.allSettled([
        sb.from("social_actions").select("*").eq("giveaway_id", row.id),
        sb.from("winners").select("*").eq("giveaway_id", row.id),
        sb.from("participants").select("giveaway_id, paid_tickets, ticket_numbers").eq("giveaway_id", row.id),
    ]);

    const actions: SocialActionRow[] = actionsRes.status === "fulfilled"
        ? (actionsRes.value.data ?? [])
        : [];
    const allWinners: WinnerRow[] = winnersRes.status === "fulfilled" ? (winnersRes.value.data ?? []) : [];
    const primaryWinner = allWinners.find((w) => !w.is_backup);
    const backupWinnersData = allWinners.filter((w) => w.is_backup);

    const gParticipants = participantsRes.status === "fulfilled" ? (participantsRes.value.data ?? []) : [];
    const hasLiveParticipants = gParticipants.length > 0;
    const realTicketsSold = hasLiveParticipants
        ? gParticipants.reduce((sum: number, p: any) => {
            const countFromTickets = Array.isArray(p.ticket_numbers) ? p.ticket_numbers.length : 0;
            const countFromPaid = Number(p.paid_tickets) || 0;
            return sum + Math.max(countFromTickets, countFromPaid);
        }, 0)
        : (row.tickets_sold as number);
    const realParticipantsCount = hasLiveParticipants
        ? gParticipants.length
        : (row.total_participants_count as number);

    return mapGiveawayFromDB(
        {
            ...row,
            tickets_sold: realTicketsSold,
            total_participants_count: realParticipantsCount,
        },
        actions.map(mapSocialActionFromDB),
        primaryWinner ? mapWinnerFromDB(primaryWinner) : undefined,
        backupWinnersData.length > 0 ? backupWinnersData.map(mapWinnerFromDB) : undefined
    );
}

/**
 * Crea un sorteo en la base de datos (Server-side).
 */
export async function createGiveawayServer(data: {
    slug: string;
    title: string;
    subtitle?: string;
    description?: string;
    sorteoNumber?: number;
    status?: Giveaway["status"];
    ticketPrice: number;
    currency?: string;
    maxParticipants?: number;
    maxTickets?: number;
    prizeName: string;
    prizeImage?: string;
    prizeValue?: string;
    prizeDetails?: string[];
    startDate: string;
    endDate: string;
    drawDate: string;
    rules?: string[];
    requirements?: Record<string, unknown>;
}): Promise<Giveaway | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = createServerClient() as any;

    // Calcular sorteoNumber si no viene
    let sorteoNum = data.sorteoNumber;
    if (!sorteoNum) {
        const { data: maxRow } = await sb
            .from("giveaways")
            .select("sorteo_number")
            .order("sorteo_number", { ascending: false })
            .limit(1)
            .single();
        sorteoNum = (maxRow?.sorteo_number ?? 0) + 1;
    }

    const insertPayload = {
        slug: data.slug,
        title: data.title,
        subtitle: data.subtitle || "",
        description: data.description || "",
        sorteo_number: sorteoNum,
        status: data.status || "upcoming",
        ticket_price: data.ticketPrice,
        currency: data.currency || "USD",
        max_participants: data.maxParticipants || null,
        max_tickets: data.maxTickets || null,
        tickets_sold: 0,
        next_ticket_seq: 1,
        total_participants_count: 0,
        prize_name: data.prizeName,
        prize_image: data.prizeImage || "",
        prize_value: data.prizeValue || null,
        prize_details: data.prizeDetails || [],
        start_date: data.startDate,
        end_date: data.endDate,
        draw_date: data.drawDate,
        rules: data.rules || [],
        requirements: data.requirements || null,
    };

    const { data: newRow, error } = await sb
        .from("giveaways")
        .insert(insertPayload)
        .select()
        .single();

    if (error || !newRow) {
        console.error("[createGiveawayServer] Error:", error?.message);
        return null;
    }

    return mapGiveawayFromDB(newRow as Record<string, unknown>, []);
}

/**
 * Actualiza un sorteo en la base de datos (Server-side).
 */
export async function updateGiveawayServer(
    id: string,
    updates: Partial<{
        title: string;
        subtitle: string;
        description: string;
        slug: string;
        ticket_price: number;
        currency: string;
        max_participants: number | null;
        max_tickets: number | null;
        status: Giveaway["status"];
        prize_name: string;
        prize_image: string;
        prize_value: string | null;
        prize_details: string[];
        end_date: string;
        draw_date: string;
        rules: string[];
    }>
): Promise<Giveaway | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = createServerClient() as any;

    const { data: updatedRow, error } = await sb
        .from("giveaways")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error || !updatedRow) {
        console.error("[updateGiveawayServer] Error:", error?.message);
        return null;
    }

    return getGiveawayByIdFromDB(id);
}

/**
 * Elimina un sorteo de la base de datos (Server-side).
 */
export async function deleteGiveawayServer(id: string): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = createServerClient() as any;

    const { error } = await sb
        .from("giveaways")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("[deleteGiveawayServer] Error:", error.message);
        return false;
    }
    return true;
}

/**
 * Registra los ganadores de un sorteo y lo marca como completado.
 */
export async function recordWinnerServer(
    giveawayId: string,
    winner: GiveawayWinner,
    backupWinners?: GiveawayWinner[]
): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = createServerClient() as any;

    // 0. Limpiar registros previos de ganadores y suplentes de este sorteo para no acumular duplicados
    await sb
        .from("winners")
        .delete()
        .eq("giveaway_id", giveawayId);

    // 1. Insertar ganador principal y máximo 3 suplentes
    const validBackups = (backupWinners || []).slice(0, 3);
    const winnerInserts = [
        {
            giveaway_id: giveawayId,
            name: winner.name,
            dni_masked: winner.dniMasked,
            total_participations: winner.totalParticipations,
            ticket_number: winner.ticketNumber,
            social_handle: winner.socialHandle || null,
            announced_at: winner.announcedAt || new Date().toISOString(),
            is_backup: false,
        },
        ...validBackups.map((b) => ({
            giveaway_id: giveawayId,
            name: b.name,
            dni_masked: b.dniMasked,
            total_participations: b.totalParticipations,
            ticket_number: b.ticketNumber,
            social_handle: b.socialHandle || null,
            announced_at: b.announcedAt || new Date().toISOString(),
            is_backup: true,
        })),
    ];

    const { error: winnerError } = await sb
        .from("winners")
        .insert(winnerInserts);

    if (winnerError) {
        console.error("[recordWinnerServer] Error inserting winners:", winnerError.message);
    }

    // 2. Marcar giveaway como completed
    const { error: gwError } = await sb
        .from("giveaways")
        .update({ status: "completed" })
        .eq("id", giveawayId);

    if (gwError) {
        console.error("[recordWinnerServer] Error updating giveaway status:", gwError.message);
        return false;
    }

    return true;
}

/**
 * Reinicia el sorteo al estado activo y elimina los ganadores registrados.
 */
export async function resetGiveawayDrawServer(giveawayId: string): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = createServerClient() as any;

    await sb.from("winners").delete().eq("giveaway_id", giveawayId);
    await sb.from("giveaways").update({ status: "active" }).eq("id", giveawayId);

    return true;
}
