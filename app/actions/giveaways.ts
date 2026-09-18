"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/app/lib/supabase/server";
import {
    findParticipantServer,
    updateParticipantServer,
    updateGiveawayCountersServer,
    getParticipantsByGiveawayServer,
} from "@/app/lib/services/supabase-giveaways";
import { generateReferralCode } from "@/app/lib/services/giveaways";
import type { Database } from "@/app/lib/supabase/types";
import { RegistrationPayload, RegistrationResult, Participant, Giveaway } from "@/app/lib/types/giveaway";

// ---------------------------------------------------------------------------
// Helper: formato de ticket
// ---------------------------------------------------------------------------
function buildTicketNumbers(sorteoNumber: number, startSeq: number, count: number): string[] {
    const sn = String(sorteoNumber).padStart(3, "0");
    return Array.from({ length: count }, (_, i) => {
        const seq = String(startSeq + i).padStart(4, "0");
        return `FORT${sn}${seq}`;
    });
}

// ---------------------------------------------------------------------------
// Server Action: Registrar participante
// ---------------------------------------------------------------------------
export async function registerParticipantAction(
    payload: RegistrationPayload
): Promise<RegistrationResult> {
    const supabase = createServerClient();
    type GiveawayRow = Database["public"]["Tables"]["giveaways"]["Row"];

    // 1. Obtener el sorteo
    const { data: giveawayRaw, error: giveawayError } = await supabase
        .from("giveaways")
        .select("*")
        .eq("id", payload.giveawayId)
        .single();

    if (giveawayError || !giveawayRaw) {
        return { success: false, message: "Sorteo no encontrado." };
    }
    const giveaway = giveawayRaw as GiveawayRow;
    if (giveaway.status !== "active") {
        return { success: false, message: "Este sorteo no está activo." };
    }

    // 2. Verificar cupo máximo
    if (giveaway.max_participants && giveaway.total_participants_count >= giveaway.max_participants) {
        return { success: false, message: "Lo sentimos, el cupo máximo de participantes para este sorteo se ha completado." };
    }

    const initialPaidTickets = payload.initialTickets ?? 0;
    const paidParticipations = initialPaidTickets * 3;

    // 3. Encriptar DNI antes de guardar
    const dniToStore = payload.dni.trim();
    // Usamos el mismo mecanismo de encriptación que el servicio local para consistencia
    // En producción, aquí iría la encriptación server-side. 
    // Por ahora guardamos el DNI como texto plano en el servidor (más seguro que localStorage).
    // TODO: Implementar encriptación server-side con crypto nativo de Node.js.

    // 4. Verificar si ya existe participante (por email o DNI)
    const existing = await findParticipantServer(payload.giveawayId, payload.email, dniToStore);

    if (existing) {
        // Si compra tickets adicionales
        if (initialPaidTickets > 0) {
            const startSeq = giveaway.next_ticket_seq;
            const newTicketNumbers = buildTicketNumbers(giveaway.sorteo_number, startSeq, initialPaidTickets);
            const updatedTicketNumbers = [...(existing.ticketNumbers ?? []), ...newTicketNumbers];
            const newPaidTickets = (existing.paidTickets ?? 0) + initialPaidTickets;
            const newPaidParticipations = newPaidTickets * 3;
            const newTotal = newPaidParticipations + (existing.referralParticipations ?? 0) + (existing.socialParticipations ?? 0);

            const updated = await updateParticipantServer(existing.id, {
                paid_tickets: newPaidTickets,
                paid_participations: newPaidParticipations,
                total_participations: newTotal,
                ticket_numbers: updatedTicketNumbers,
                ...(payload.phone ? { phone: payload.phone.trim() } : {}),
            });

            await updateGiveawayCountersServer(payload.giveawayId, {
                tickets_sold: (giveaway.tickets_sold ?? 0) + initialPaidTickets,
                next_ticket_seq: startSeq + initialPaidTickets,
            });

            revalidatePath("/sorteos");
            revalidatePath(`/sorteos/${giveaway.slug}`);

            return {
                success: true,
                participant: updated ?? existing,
                message: `¡Se agregaron +${initialPaidTickets} ticket(s) exitosamente!`,
            };
        }

        return {
            success: true,
            participant: existing,
            isExisting: true,
            message: "¡Este documento ya está registrado en este sorteo! Aquí tienes tus datos.",
        };
    }

    // 5. Nuevo participante
    const startSeq = giveaway.next_ticket_seq;
    const ticketNumbers = initialPaidTickets > 0
        ? buildTicketNumbers(giveaway.sorteo_number, startSeq, initialPaidTickets)
        : [];

    // 6. Actualizar referente si aplica
    if (payload.referralCode) {
        const { data: referrerRaw } = await supabase
            .from("participants")
            .select("*")
            .eq("giveaway_id", payload.giveawayId)
            .eq("referral_code", payload.referralCode.toUpperCase())
            .single();

        if (referrerRaw) {
            const referrer = referrerRaw as Database["public"]["Tables"]["participants"]["Row"];
            const newRefCount = (referrer.referral_count ?? 0) + 1;
            const newRefParts = Math.floor(newRefCount / 3);
            const newTotal = (referrer.paid_participations ?? 0) + newRefParts + (referrer.social_participations ?? 0);
            await updateParticipantServer(referrer.id, {
                referral_count: newRefCount,
                referral_participations: newRefParts,
                total_participations: newTotal,
            });
        }
    }

    const referralCode = generateReferralCode(payload.fullName);

    type ParticipantInsert = Database["public"]["Tables"]["participants"]["Insert"];
    const insertPayload: ParticipantInsert = {
        id: crypto.randomUUID(),
        giveaway_id: payload.giveawayId,
        full_name: payload.fullName.trim(),
        email: payload.email.trim().toLowerCase(),
        phone: payload.phone?.trim() ?? null,
        dni: dniToStore,
        birth_date: payload.birthDate || null,
        referral_code: referralCode,
        referred_by: payload.referralCode?.toUpperCase() ?? null,
        paid_tickets: initialPaidTickets,
        paid_participations: paidParticipations,
        referral_count: 0,
        referral_participations: 0,
        social_participations: 0,
        total_participations: paidParticipations,
        ticket_numbers: ticketNumbers as string[],
        social_handles: null,
        completed_social_action_ids: [] as string[],
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: newParticipantRow, error: insertError } = await (supabase as any)
        .from("participants")
        .insert(insertPayload)
        .select()
        .single();

    if (insertError || !newParticipantRow) {
        console.error("[registerParticipantAction] Insert error:", insertError?.message);
        return { success: false, message: "Error al guardar el registro. Intenta de nuevo." };
    }
    const insertedRow = newParticipantRow as Database["public"]["Tables"]["participants"]["Row"];

    // 7. Actualizar contadores del sorteo
    await updateGiveawayCountersServer(payload.giveawayId, {
        tickets_sold: (giveaway.tickets_sold ?? 0) + initialPaidTickets,
        next_ticket_seq: startSeq + initialPaidTickets,
        total_participants_count: (giveaway.total_participants_count ?? 0) + 1,
    });

    revalidatePath("/sorteos");
    revalidatePath(`/sorteos/${giveaway.slug}`);

    const newParticipant: Participant = {
        id: insertedRow.id,
        giveawayId: insertedRow.giveaway_id,
        fullName: insertedRow.full_name,
        email: insertedRow.email,
        phone: insertedRow.phone ?? undefined,
        dni: insertedRow.dni,
        birthDate: insertedRow.birth_date?.toString() ?? "",
        referralCode: insertedRow.referral_code,
        referredBy: insertedRow.referred_by ?? undefined,
        paidTickets: insertedRow.paid_tickets,
        paidParticipations: insertedRow.paid_participations,
        referralCount: insertedRow.referral_count,
        referralParticipations: insertedRow.referral_participations,
        socialParticipations: insertedRow.social_participations,
        totalParticipations: insertedRow.total_participations,
        ticketNumbers: insertedRow.ticket_numbers ?? [],
        completedSocialActionIds: insertedRow.completed_social_action_ids ?? [],
        registeredAt: insertedRow.registered_at,
    };

    return {
        success: true,
        participant: newParticipant,
        message: "¡Registro completado! Ya estás dentro del sorteo oficial.",
    };
}

// ---------------------------------------------------------------------------
// Server Action: Compra de tickets adicionales
// ---------------------------------------------------------------------------
export async function buyTicketsAction(
    giveawayId: string,
    participantId: string,
    quantity: number
): Promise<{ success: boolean; participant?: Participant; message?: string }> {
    if (quantity <= 0) return { success: false, message: "Cantidad inválida." };

    const supabase = createServerClient();
    type GiveawayRow = Database["public"]["Tables"]["giveaways"]["Row"];
    type ParticipantRow = Database["public"]["Tables"]["participants"]["Row"];

    const { data: giveawayRaw } = await supabase
        .from("giveaways")
        .select("*")
        .eq("id", giveawayId)
        .single();

    if (!giveawayRaw) return { success: false, message: "Sorteo no encontrado." };
    const giveaway = giveawayRaw as GiveawayRow;

    if (giveaway.max_tickets && (giveaway.tickets_sold + quantity) > giveaway.max_tickets) {
        return {
            success: false,
            message: `Solo quedan ${giveaway.max_tickets - giveaway.tickets_sold} tickets disponibles.`,
        };
    }

    const { data: participantRaw } = await supabase
        .from("participants")
        .select("*")
        .eq("id", participantId)
        .eq("giveaway_id", giveawayId)
        .single();

    if (!participantRaw) return { success: false, message: "Participante no encontrado." };
    const participant = participantRaw as ParticipantRow;

    const startSeq = giveaway.next_ticket_seq;
    const newTicketNums = buildTicketNumbers(giveaway.sorteo_number, startSeq, quantity);
    const newPaidTickets = (participant.paid_tickets ?? 0) + quantity;
    const newPaidParticipations = newPaidTickets * 3;
    const newTotal = newPaidParticipations + (participant.referral_participations ?? 0) + (participant.social_participations ?? 0);
    const updatedTicketNumbers = [...(participant.ticket_numbers ?? []), ...newTicketNums];

    const updated = await updateParticipantServer(participantId, {
        paid_tickets: newPaidTickets,
        paid_participations: newPaidParticipations,
        total_participations: newTotal,
        ticket_numbers: updatedTicketNumbers,
    });

    await updateGiveawayCountersServer(giveawayId, {
        tickets_sold: (giveaway.tickets_sold ?? 0) + quantity,
        next_ticket_seq: startSeq + quantity,
    });

    revalidatePath(`/sorteos/${giveaway.slug}`);

    return {
        success: true,
        participant: updated ?? undefined,
        message: `¡Compra exitosa de ${quantity} ticket(s)! Se sumaron +${quantity * 3} participaciones.`,
    };
}

// ---------------------------------------------------------------------------
// Server Action: Completar acción social
// ---------------------------------------------------------------------------
export async function completeSocialActionAction(
    giveawayId: string,
    participantId: string,
    actionId: string,
    socialHandle: string
): Promise<{ success: boolean; participant?: Participant }> {
    const supabase = createServerClient();
    type SocialActionRow = Database["public"]["Tables"]["social_actions"]["Row"];
    type ParticipantRow = Database["public"]["Tables"]["participants"]["Row"];

    // Obtener la acción social para saber cuántas participaciones bonus da
    const { data: actionRaw } = await supabase
        .from("social_actions")
        .select("*")
        .eq("id", actionId)
        .eq("giveaway_id", giveawayId)
        .single();

    if (!actionRaw) return { success: false };
    const action = actionRaw as SocialActionRow;

    const { data: participantRaw } = await supabase
        .from("participants")
        .select("*")
        .eq("id", participantId)
        .eq("giveaway_id", giveawayId)
        .single();

    if (!participantRaw) return { success: false };
    const participant = participantRaw as ParticipantRow;

    const completedIds: string[] = participant.completed_social_action_ids ?? [];
    if (completedIds.includes(actionId)) {
        // Ya completó esta acción — retornar éxito sin modificar
        return { success: true };
    }

    const newCompletedIds = [...completedIds, actionId];
    const newSocialParticipations = (participant.social_participations ?? 0) + action.bonus_participations;
    const newTotal = (participant.paid_participations ?? 0) + (participant.referral_participations ?? 0) + newSocialParticipations;
    const newSocialHandles = {
        ...((participant.social_handles ?? {}) as Record<string, string>),
        [action.platform]: socialHandle,
    };

    const updated = await updateParticipantServer(participantId, {
        completed_social_action_ids: newCompletedIds,
        social_participations: newSocialParticipations,
        total_participations: newTotal,
        social_handles: newSocialHandles,
    });

    revalidatePath(`/sorteos/${giveawayId}`);

    return { success: true, participant: updated ?? undefined };
}

// ---------------------------------------------------------------------------
// Server Action: Obtener todos los sorteos
// ---------------------------------------------------------------------------
export async function getGiveawaysAction(): Promise<Giveaway[]> {
    const { getGiveawaysFromDB } = await import("@/app/lib/services/supabase-giveaways");
    return getGiveawaysFromDB();
}

// ---------------------------------------------------------------------------
// Server Action: Crear un sorteo (para admin)
// ---------------------------------------------------------------------------
export async function createGiveawayAction(data: {
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
}): Promise<{ success: boolean; giveaway?: Giveaway; message?: string }> {
    const { createGiveawayServer } = await import("@/app/lib/services/supabase-giveaways");
    const result = await createGiveawayServer(data);
    if (!result) return { success: false, message: "Error al crear el sorteo en la base de datos." };
    revalidatePath("/sorteos");
    revalidatePath("/sorteos/admin");
    return { success: true, giveaway: result };
}

// ---------------------------------------------------------------------------
// Server Action: Actualizar un sorteo (para admin)
// ---------------------------------------------------------------------------
export async function updateGiveawayAction(
    id: string,
    updates: Parameters<typeof import("@/app/lib/services/supabase-giveaways")["updateGiveawayServer"]>[1]
): Promise<{ success: boolean; giveaway?: Giveaway; message?: string }> {
    const { updateGiveawayServer } = await import("@/app/lib/services/supabase-giveaways");
    const result = await updateGiveawayServer(id, updates);
    if (!result) return { success: false, message: "Error al actualizar el sorteo." };
    revalidatePath("/sorteos");
    revalidatePath("/sorteos/admin");
    revalidatePath(`/sorteos/${result.slug}`);
    return { success: true, giveaway: result };
}

// ---------------------------------------------------------------------------
// Server Action: Eliminar un sorteo (para admin)
// ---------------------------------------------------------------------------
export async function deleteGiveawayAction(id: string): Promise<{ success: boolean; message?: string }> {
    const { deleteGiveawayServer } = await import("@/app/lib/services/supabase-giveaways");
    const ok = await deleteGiveawayServer(id);
    if (!ok) return { success: false, message: "Error al eliminar el sorteo." };
    revalidatePath("/sorteos");
    revalidatePath("/sorteos/admin");
    return { success: true };
}

// ---------------------------------------------------------------------------
// Server Action: Registrar ganadores y finalizar sorteo (para live)
// ---------------------------------------------------------------------------
export async function recordWinnerAction(
    giveawayId: string,
    winner: import("@/app/lib/types/giveaway").GiveawayWinner,
    backupWinners?: import("@/app/lib/types/giveaway").GiveawayWinner[]
): Promise<{ success: boolean }> {
    const { recordWinnerServer } = await import("@/app/lib/services/supabase-giveaways");
    const ok = await recordWinnerServer(giveawayId, winner, backupWinners);
    revalidatePath("/sorteos");
    revalidatePath("/sorteos/ganadores");
    return { success: ok };
}

// ---------------------------------------------------------------------------
// Server Action: Obtener participantes de un sorteo (para admin y live)
// ---------------------------------------------------------------------------
export async function getGiveawayParticipantsAction(
    giveawayId: string
): Promise<Participant[]> {
    return getParticipantsByGiveawayServer(giveawayId);
}

// ---------------------------------------------------------------------------
// Server Action: Buscar participante por DNI
// ---------------------------------------------------------------------------
export async function findParticipantByDniAction(
    giveawayId: string,
    dniInput: string
): Promise<Participant | null> {
    const clean = dniInput.trim().replace(/\D/g, "");
    if (!clean) return null;

    const participants = await getParticipantsByGiveawayServer(giveawayId);
    return participants.find((p) => {
        const pClean = (p.dni ?? "").replace(/\D/g, "");
        return (
            pClean === clean ||
            (clean.length >= 5 && pClean.endsWith(clean)) ||
            (clean.length >= 5 && pClean.slice(-5) === clean.slice(-5))
        );
    }) ?? null;
}

// ---------------------------------------------------------------------------
// Server Action: Reiniciar simulación de sorteo
// ---------------------------------------------------------------------------
export async function resetGiveawayDrawAction(giveawayId: string): Promise<{ success: boolean }> {
    const { resetGiveawayDrawServer } = await import("@/app/lib/services/supabase-giveaways");
    const ok = await resetGiveawayDrawServer(giveawayId);
    revalidatePath("/sorteos");
    revalidatePath("/sorteos/ganadores");
    return { success: ok };
}


