import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Cliente Supabase para uso en el BROWSER (Client Components).
 * Usa la clave anon — solo operaciones de lectura pública.
 */
export function createClient() {
    return createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}
