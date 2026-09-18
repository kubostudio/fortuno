import { notFound } from "next/navigation";
import { INITIAL_GIVEAWAYS } from "@/app/lib/services/giveaways";
import { getGiveawayBySlugFromDB, getParticipantsByGiveawayServer } from "@/app/lib/services/supabase-giveaways";
import type { Participant } from "@/app/lib/types/giveaway";
import LiveDrawClient from "./LiveDrawClient";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function LiveDrawPage({ params }: PageProps) {
    const resolvedParams = await params;

    let giveaway = null;
    let participants: Participant[] = [];

    try {
        giveaway = await getGiveawayBySlugFromDB(resolvedParams.slug);
        if (giveaway) {
            participants = await getParticipantsByGiveawayServer(giveaway.id);
        }
    } catch (e) {
        console.error("[LiveDrawPage] Supabase error:", e);
    }

    if (!giveaway) {
        giveaway = INITIAL_GIVEAWAYS.find((g) => g.slug === resolvedParams.slug) || null;
    }

    if (!giveaway) {
        notFound();
    }

    return <LiveDrawClient initialGiveaway={giveaway} initialParticipants={participants} />;
}
