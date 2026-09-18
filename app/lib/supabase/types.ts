/**
 * Tipos TypeScript generados a partir del esquema de Supabase.
 * Refleja exactamente las tablas y columnas del archivo de migración.
 */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type GiveawayStatus = "active" | "upcoming" | "completed" | "paused";
export type SocialPlatform = "instagram" | "tiktok" | "youtube" | "x" | "facebook";
export type SocialActionType = "follow" | "subscribe" | "share";

export interface Database {
    public: {
        Tables: {
            giveaways: {
                Row: {
                    id: string;
                    slug: string;
                    title: string;
                    subtitle: string | null;
                    description: string | null;
                    sorteo_number: number;
                    status: GiveawayStatus;
                    ticket_price: number;
                    currency: string;
                    max_participants: number | null;
                    max_tickets: number | null;
                    tickets_sold: number;
                    next_ticket_seq: number;
                    total_participants_count: number;
                    prize_name: string;
                    prize_image: string | null;
                    prize_value: string | null;
                    prize_details: string[] | null;
                    start_date: string;
                    end_date: string;
                    draw_date: string;
                    rules: string[] | null;
                    requirements: Json | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database["public"]["Tables"]["giveaways"]["Row"], "created_at" | "updated_at"> & {
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["giveaways"]["Insert"]>;
            };
            social_actions: {
                Row: {
                    id: string;
                    giveaway_id: string;
                    platform: SocialPlatform;
                    title: string;
                    description: string | null;
                    url: string;
                    bonus_participations: number;
                    action_type: SocialActionType;
                };
                Insert: Database["public"]["Tables"]["social_actions"]["Row"];
                Update: Partial<Database["public"]["Tables"]["social_actions"]["Row"]>;
            };
            participants: {
                Row: {
                    id: string;
                    giveaway_id: string;
                    full_name: string;
                    email: string;
                    phone: string | null;
                    dni: string; // Encriptado AES-GCM en la capa de aplicación
                    birth_date: string | null;
                    referral_code: string;
                    referred_by: string | null;
                    paid_tickets: number;
                    paid_participations: number;
                    referral_count: number;
                    referral_participations: number;
                    social_participations: number;
                    total_participations: number;
                    ticket_numbers: string[];
                    social_handles: Json | null;
                    completed_social_action_ids: string[];
                    registered_at: string;
                };
                Insert: Omit<Database["public"]["Tables"]["participants"]["Row"], "registered_at"> & {
                    registered_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["participants"]["Insert"]>;
            };
            winners: {
                Row: {
                    id: string;
                    giveaway_id: string;
                    participant_id: string | null;
                    name: string;
                    dni_masked: string | null;
                    total_participations: number | null;
                    ticket_number: string;
                    social_handle: string | null;
                    announced_at: string;
                    is_backup: boolean;
                };
                Insert: Omit<Database["public"]["Tables"]["winners"]["Row"], "is_backup"> & {
                    is_backup?: boolean;
                };
                Update: Partial<Database["public"]["Tables"]["winners"]["Insert"]>;
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: {
            giveaway_status: GiveawayStatus;
            social_platform: SocialPlatform;
            social_action_type: SocialActionType;
        };
    };
}
