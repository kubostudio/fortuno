import { notFound } from "next/navigation";
import { INITIAL_GIVEAWAYS } from "@/app/lib/services/giveaways";
import { getGiveawayBySlugFromDB } from "@/app/lib/services/supabase-giveaways";
import GiveawayDetailClient from "./GiveawayDetailClient";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function GiveawayDetailPage({ params }: PageProps) {
    const resolvedParams = await params;

    let giveaway = null;

    // 1. Obtener sorteo desde Supabase
    try {
        giveaway = await getGiveawayBySlugFromDB(resolvedParams.slug);
    } catch (e) {
        console.error("[GiveawayDetailPage] Supabase error:", e);
    }

    // 2. Fallback estático si no está en BD
    if (!giveaway) {
        giveaway = INITIAL_GIVEAWAYS.find((g) => g.slug === resolvedParams.slug) || null;
    }

    if (!giveaway) {
        notFound();
    }

    return <GiveawayDetailClient giveaway={giveaway} />;
}
