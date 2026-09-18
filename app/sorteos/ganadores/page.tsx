import { INITIAL_GIVEAWAYS } from "@/app/lib/services/giveaways";
import { getGiveawaysFromDB } from "@/app/lib/services/supabase-giveaways";
import GanadoresClient from "./GanadoresClient";

export default async function GanadoresPage() {
    let giveaways = INITIAL_GIVEAWAYS;

    try {
        const fromDB = await getGiveawaysFromDB();
        if (fromDB && fromDB.length > 0) {
            giveaways = fromDB;
        }
    } catch (e) {
        console.error("[GanadoresPage] Supabase error:", e);
    }

    return <GanadoresClient initialGiveaways={giveaways} />;
}
