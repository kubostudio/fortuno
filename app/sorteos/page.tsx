import { INITIAL_GIVEAWAYS } from "@/app/lib/services/giveaways";
import { getGiveawaysFromDB } from "@/app/lib/services/supabase-giveaways";
import SorteosClient from "./SorteosClient";

/**
 * Server Component — Obtiene sorteos desde Supabase en el servidor.
 * Si las variables de entorno no están configuradas, usa INITIAL_GIVEAWAYS como fallback.
 */
export default async function SorteosPage() {
    const isSupabaseConfigured =
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("tu-proyecto");

    let giveaways = INITIAL_GIVEAWAYS;

    if (isSupabaseConfigured) {
        const fromDB = await getGiveawaysFromDB();
        if (fromDB.length > 0) {
            giveaways = fromDB;
        }
    }

    return <SorteosClient initialGiveaways={giveaways} />;
}

