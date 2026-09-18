"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Calendar, Trophy, Clock, ArrowRight } from "lucide-react";
import { Giveaway } from "@/app/lib/types/giveaway";
import { formatFriendlyDateTime } from "@/app/lib/utils/date";
import styles from "./GiveawayCard.module.css";

interface GiveawayCardProps {
    giveaway: Giveaway;
    onRegisterClick?: (giveaway: Giveaway) => void;
}

export default function GiveawayCard({ giveaway, onRegisterClick }: GiveawayCardProps) {
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
    const eventDate = new Date(giveaway.endDate);
    useEffect(() => {
        function calculateTime() {
            const target = new Date(giveaway.endDate).getTime();
            const now = new Date().getTime();
            const diff = target - now;

            if (diff <= 0) {
                setTimeLeft(null);
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds });
        }

        calculateTime();
        const interval = setInterval(calculateTime, 1000);
        return () => clearInterval(interval);
    }, [giveaway.endDate]);

    const isCompleted = giveaway.status === "completed";
    const isUpcoming = giveaway.status === "upcoming";
    const isPaused = giveaway.status === "paused";

    return (
        <article className={`${styles.card} ${isCompleted ? styles.completed : ""} ${isPaused ? styles.pausedCard : ""}`}>
            <div className={styles.imageContainer}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={giveaway.prize.image}
                    alt={giveaway.prize.name}
                    className={styles.image}
                    loading="lazy"
                />
                <div className={styles.statusBadgeWrapper}>
                    {giveaway.status === "active" && (
                        <span className={`${styles.badge} ${styles.badgeActive}`}>
                            Activo
                        </span>
                    )}
                    {isUpcoming && (
                        <span className={`${styles.badge} ${styles.badgeUpcoming}`}>
                            Próximamente
                        </span>
                    )}
                    {isPaused && (
                        <span className={`${styles.badge} ${styles.badgePaused}`}>
                            Pausado
                        </span>
                    )}
                    {isCompleted && (
                        <span className={`${styles.badge} ${styles.badgeCompleted}`}>
                            Finalizado
                        </span>
                    )}
                </div>

                <div className={styles.priceFloatingTag}>
                    S/.{giveaway.ticketPrice}
                </div>
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{giveaway.title}</h3>
                <p className={styles.subtitle}>{giveaway.subtitle}</p>
                <div className={styles.metaRow}>
                    {/* <span className={styles.ticketsCount} suppressHydrationWarning>
                        <Users size={15} />
                        {giveaway.totalParticipantsCount.toLocaleString()} inscritos
                    </span> */}
                    <span className={styles.ticketsCount} suppressHydrationWarning>
                        <Calendar size={15} /> {formatFriendlyDateTime(giveaway.endDate || giveaway.drawDate)}
                    </span>
                </div>

                {isCompleted && giveaway.winner && (
                    <div className={styles.winnerBox}>
                        <div className={styles.winnerIcon}>
                            <Trophy size={20} className={styles.trophyIcon} />
                        </div>
                        <div className={styles.winnerInfo}>
                            <span className={styles.winnerLabel}>Ganador Certificado:</span>
                            <strong className={styles.winnerName}>{giveaway.winner.name}</strong>
                            <small className={styles.winnerDni}>DNI: {giveaway.winner.dniMasked} • Ticket {giveaway.winner.ticketNumber}</small>
                        </div>
                    </div>
                )}

                <div className={styles.actions}>
                    {giveaway.status === "active" || isUpcoming ? (
                        <Link
                            href={`/sorteos/${giveaway.slug}`}
                            className={styles.btnPrimaryFull}
                        >
                            Más detalles <ArrowRight size={15} />
                        </Link>
                    ) : isPaused ? (
                        <Link
                            href={`/sorteos/${giveaway.slug}`}
                            className={styles.btnPausedFull}
                        >
                            Sorteo no disponible por ahora
                        </Link>
                    ) : (
                        <Link
                            href={`/sorteos/${giveaway.slug}`}
                            className={styles.btnFull}
                        >
                            Ver Resultados y Ganadores
                        </Link>
                    )}
                </div>
            </div>
        </article>
    );
}
