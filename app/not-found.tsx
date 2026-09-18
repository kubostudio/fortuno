import Link from "next/link";
import {
    Compass,
    Sparkles,
    Ticket,
    ArrowLeft,
    ChevronRight,
    Dices,
    Gift,
    Users,
    Coins,
    RotateCcw,
    Hash
} from "lucide-react";
import { INITIAL_GIVEAWAYS } from "@/app/lib/services/giveaways";
import { getGiveawaysFromDB } from "@/app/lib/services/supabase-giveaways";
import styles from "./not-found.module.css";

export const metadata = {
    title: "404 - Página no encontrada | Fortuno",
    description: "La página que buscas no existe, pero puedes participar en los sorteos activos de Fortuno o usar nuestras herramientas de azar gratuitas.",
};

// Catálogo publicitario de herramientas gratuitas de Fortuno
const FREE_TOOLS_PROMO = [
    {
        title: "Ruleta de Nombres",
        description: "Gira la ruleta virtual y elige ganadores o toma decisiones en segundos.",
        href: "/herramientas/ruleta",
        icon: <RotateCcw size={22} />,
    },
    {
        title: "Sorteo de Premios",
        description: "Distribuye regalos y premios entre tus participantes de forma transparente.",
        href: "/herramientas/sorteo-de-premios",
        icon: <Gift size={22} />,
    },
    {
        title: "Número Aleatorio",
        description: "Generador de números sin repetir para rifas, sorteos escolares y loterías.",
        href: "/herramientas/numero-aleatorio",
        icon: <Hash size={22} />,
    },
    {
        title: "Amigo Secreto",
        description: "Organiza sorteos de regalos con amigos o compañeros con exclusiones.",
        href: "/herramientas/amigo-secreto",
        icon: <Sparkles size={22} />,
    },
    {
        title: "Formar Equipos",
        description: "Divide una lista de personas en grupos equilibrados y justos al instante.",
        href: "/herramientas/formar-equipos",
        icon: <Users size={22} />,
    },
    {
        title: "Lanzar Moneda",
        description: "Moneda digital 3D de cara o cruz para resolver empates al momento.",
        href: "/herramientas/lanzar-moneda",
        icon: <Coins size={22} />,
    },
];

export default async function NotFound() {
    let giveaways = INITIAL_GIVEAWAYS;

    try {
        const fromDB = await getGiveawaysFromDB();
        if (fromDB && fromDB.length > 0) {
            giveaways = fromDB;
        }
    } catch {
        // Fallback a INITIAL_GIVEAWAYS
    }

    const activeGiveaways = giveaways.filter((g) => g.status === "active");

    return (
        <main className={styles.page}>
            {/* 1. Hero 404 */}
            <section className={styles.hero}>
                <span className={styles.glitchCode}>404</span>

                <h1 className={styles.heroTitle}>
                    ¡Ups! Esta página no existe, pero tu suerte sigue aquí
                </h1>

                <div className={styles.heroActions}>
                    <Link href="/" className={styles.btnSecondary}>
                        <ArrowLeft size={16} /> Volver al Inicio
                    </Link>
                    <Link href="/sorteos" className={styles.btnPrimary}>
                        <Ticket size={16} /> Ver Todos los Sorteos
                    </Link>
                </div>
            </section>
        </main>
    );
}
