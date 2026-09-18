import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Cliente Supabase para uso en el SERVIDOR (Server Components, Server Actions, Route Handlers).
 * Usa la SERVICE ROLE KEY — tiene acceso completo, bypassea RLS.
 * NUNCA exponer esta key al cliente.
 */
export function createServerClient() {
    return createSupabaseClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}
