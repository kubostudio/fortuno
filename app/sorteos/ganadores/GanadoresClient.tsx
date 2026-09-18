"use client";

import { useState } from "react";
import Link from "next/link";
import { Trophy, ArrowLeft, Search, ShieldCheck, Calendar, ExternalLink } from "lucide-react";
import { Giveaway } from "@/app/lib/types/giveaway";
import { formatFriendlyDate } from "@/app/lib/utils/date";
import styles from "./page.module.css";

interface GanadoresClientProps {
    initialGiveaways: Giveaway[];
}

export default function GanadoresClient({ initialGiveaways }: GanadoresClientProps) {
    const [search, setSearch] = useState("");
    const [giveaways] = useState(initialGiveaways);

    const completedGiveaways = giveaways.filter((g) => g.status === "completed");

    const filtered = completedGiveaways.filter((g) => {
        if (!search.trim()) return true;
        const query = search.toLowerCase();
        return (
            g.title.toLowerCase().includes(query) ||
            g.winner?.name.toLowerCase().includes(query) ||
            g.winner?.dniMasked.toLowerCase().includes(query)
        );
    });

    return (
        <main className={styles.container}>
            <div className={styles.topNav}>
                <Link href="/sorteos" className={styles.backLink}>
                    <ArrowLeft size={16} /> Volver a Sorteos
                </Link>
            </div>

            <div className={styles.header}>
                <h1 className={styles.title}>Historial de Ganadores & Sorteos Anteriores</h1>
                <p className={styles.subtitle}>
                    Registro público y certificado de todos los sorteos ejecutados en vivo en Fortuno.
                </p>
            </div>

            {/* Search Bar */}
            <div className={styles.searchBar}>
                <Search size={18} className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Buscar por nombre de ganador, DNI o título del sorteo..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Winners Grid */}
            <div className={styles.grid}>
                {filtered.map((g) => (
                    <div key={g.id} className={styles.winnerCard}>
                        <div className={styles.imageBox}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={g.prize.image} alt={g.prize.name} />
                            <span className={styles.certifiedBadge}>
                                <ShieldCheck size={14} /> Sorteo Auditado
                            </span>
                        </div>

                        <div className={styles.cardContent}>
                            <span className={styles.giveawayCategory}>Sorteo Finalizado</span>
                            <h3 className={styles.cardTitle}>{g.title}</h3>

                            {g.winner && (
                                <div className={styles.winnerBox}>
                                    <div className={styles.winnerHeader}>
                                        <Trophy size={18} className={styles.winnerTrophy} />
                                        <span>Ganador Oficial:</span>
                                    </div>
                                    <h4 className={styles.winnerName}>{g.winner.name}</h4>
                                    <div className={styles.winnerMeta}>
                                        <span>DNI: {g.winner.dniMasked}</span>
                                        <span>Ticket: {g.winner.ticketNumber}</span>
                                        <span>{g.winner.totalParticipations} participaciones</span>
                                    </div>
                                </div>
                            )}

                            <div className={styles.footerRow}>
                                <span className={styles.drawDate} suppressHydrationWarning>
                                    <Calendar size={14} /> {formatFriendlyDate(g.drawDate)}
                                </span>
                                <Link href={`/sorteos/${g.slug}`} className={styles.viewDetailsBtn}>
                                    Ver Detalle <ExternalLink size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className={styles.emptyState}>
                    <p>No se encontraron ganadores que coincidan con tu búsqueda.</p>
                </div>
            )}
        </main>
    );
}
