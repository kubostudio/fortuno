"use client";

import { useState, useRef, useMemo } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
    ArrowLeft,
    Play,
    RotateCcw,
    Trophy,
    Volume2,
    VolumeX,
    Maximize2,
    Minimize2,
    Users,
    Ticket,
    ShieldCheck,
    Calendar,
    UserSearch,
    Shield,
    CheckCircle2
} from "lucide-react";
import { Participant, GiveawayWinner, Giveaway } from "@/app/lib/types/giveaway";
import { recordWinnerAction, findParticipantByDniAction, resetGiveawayDrawAction } from "@/app/actions/giveaways";
import { formatFriendlyDateTime } from "@/app/lib/utils/date";
import styles from "./page.module.css";

// Colores de las pelotas de la tómbola
const BALL_COLORS = [
    "#ef4444", "#3b82f6", "#22c55e", "#f59e0b",
    "#a855f7", "#ec4899", "#06b6d4", "#f97316",
    "#10b981", "#6366f1", "#84cc16", "#e11d48"
];

// Animaciones CSS para cada posición de pelota en la tómbola
const BALL_ANIMS = [
    styles.ball0, styles.ball1, styles.ball2, styles.ball3,
    styles.ball4, styles.ball5, styles.ball6, styles.ball7,
    styles.ball8, styles.ball9, styles.ball10, styles.ball11,
    styles.ball12, styles.ball13, styles.ball14
];

type DrawPhase = "idle" | "spinning" | "revealing" | "done";

interface LiveDrawClientProps {
    initialGiveaway: Giveaway;
    initialParticipants: Participant[];
}

/**
 * Enmascara el DNI mostrando solo los últimos 5 dígitos.
 */
function maskDni(dni: string): string {
    if (!dni) return "********";
    if (dni.length <= 5) return `***${dni}`;
    const visible = dni.slice(-5);
    return `${"*".repeat(dni.length - 5)}${visible}`;
}

/**
 * Formatea el nombre para privacidad.
 */
function maskName(fullName: string): string {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 4) {
        const [firstName, secondName, firstLastname, secondLastname] = parts;
        return `${firstLastname} ${secondLastname[0]?.toUpperCase() || ""}.  ·  ${firstName} ${secondName[0]?.toUpperCase() || ""}.`;
    } else if (parts.length === 3) {
        const [firstName, firstLastname, secondLastname] = parts;
        return `${firstLastname} ${secondLastname[0]?.toUpperCase() || ""}.  ·  ${firstName}`;
    } else if (parts.length === 2) {
        const [firstName, firstLastname] = parts;
        return `${firstLastname}  ·  ${firstName}`;
    }
    return fullName;
}

export default function LiveDrawClient({ initialGiveaway, initialParticipants }: LiveDrawClientProps) {
    const [giveaway] = useState<Giveaway>(initialGiveaway);
    const [participants] = useState<Participant[]>(initialParticipants);
    const [phase, setPhase] = useState<DrawPhase>(giveaway.winner ? "done" : "idle");
    const [winner, setWinner] = useState<GiveawayWinner | null>(giveaway.winner || null);
    const [winnerBallColor, setWinnerBallColor] = useState("#f59e0b");
    const [backupWinners, setBackupWinners] = useState<GiveawayWinner[]>(giveaway.backupWinners || []);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);

    // Buscador por DNI (reutilizado de la landing)
    const [dniInput, setDniInput] = useState("");
    const [searchResult, setSearchResult] = useState<Participant | null | "not_found" | "searching">(null);

    // Filtro para el visor de boletos
    const [ticketFilter, setTicketFilter] = useState("");

    // Todos los boletos de todos los participantes
    const allTickets = useMemo(() => {
        return participants.flatMap((p) => p.ticketNumbers || []);
    }, [participants]);

    // Pool de todas las entradas individuales de boletos (cada ticket es una oportunidad en el bombo)
    const allTicketEntries = useMemo(() => {
        const entries: Array<{ ticketNumber: string; participant: Participant }> = [];
        for (const p of participants) {
            if (p.ticketNumbers && p.ticketNumbers.length > 0) {
                for (const t of p.ticketNumbers) {
                    entries.push({ ticketNumber: t, participant: p });
                }
            }
        }
        return entries;
    }, [participants]);

    const totalParticipations = useMemo(() => {
        return participants.reduce((acc, p) => acc + p.totalParticipations, 0);
    }, [participants]);

    // Pelotas visibles dentro del bombo (hasta 15), distribuidas a lo largo de toda la lista
    const visualBalls = useMemo(() => {
        if (allTickets.length <= 15) return allTickets;
        const step = allTickets.length / 15;
        return Array.from({ length: 15 }, (_, i) => allTickets[Math.floor(i * step)]);
    }, [allTickets]);

    // Audio Web API: sintetizador de efectos de sonido
    function playBeep(freq = 440, type: OscillatorType = "sine", duration = 0.1) {
        if (!soundEnabled) return;
        try {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
            }
            const ctx = audioCtxRef.current;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch {
            // Audio not allowed without prior interaction
        }
    }

    function playFanfare() {
        if (!soundEnabled) return;
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            setTimeout(() => playBeep(freq, "triangle", 0.35), idx * 120);
        });
    }

    function playTensionRoll() {
        if (!soundEnabled) return;
        let count = 0;
        const interval = setInterval(() => {
            playBeep(200 + count * 15, "square", 0.05);
            count++;
            if (count > 25) clearInterval(interval);
        }, 120);
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => { });
        } else {
            document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => { });
        }
    }

    function triggerConfetti() {
        try {
            confetti({
                particleCount: 130,
                spread: 90,
                origin: { y: 0.55 },
                colors: ["#38bdf8", "#fbbf24", "#34d399", "#a855f7", "#ef4444"]
            });
            setTimeout(() => {
                confetti({
                    particleCount: 70,
                    angle: 60,
                    spread: 60,
                    origin: { x: 0.1 }
                });
                confetti({
                    particleCount: 70,
                    angle: 120,
                    spread: 60,
                    origin: { x: 0.9 }
                });
            }, 300);
        } catch {
            // canvas-confetti
        }
    }

    function handleStartDraw() {
        if (allTicketEntries.length === 0 || phase === "spinning") return;

        setPhase("spinning");
        setWinner(null);
        setBackupWinners([]);
        playTensionRoll();

        // 4.5 segundos de mezcla y tensión
        setTimeout(() => {
            handlePickWinner();
        }, 4500);
    }

    function handlePickWinner() {
        if (allTicketEntries.length === 0) return;

        // 1. Selección directa por TICKET: cada boleto en el bombo tiene la misma oportunidad
        const poolCopy = [...allTicketEntries];
        const winIdx = Math.floor(Math.random() * poolCopy.length);
        const winningEntry = poolCopy[winIdx];
        const winTicket = winningEntry.ticketNumber;
        const selected = winningEntry.participant;

        // Elegir color de la pelota ganadora
        const randomColor = BALL_COLORS[Math.floor(Math.random() * BALL_COLORS.length)];
        setWinnerBallColor(randomColor);

        // 2. Selección de 3 SUPLENTES directamente por TICKET
        // Se excluyen los boletos del ganador principal para garantizar que los suplentes sean personas diferentes
        const backups: GiveawayWinner[] = [];
        let backupTicketPool = poolCopy.filter((entry) => entry.participant.id !== selected.id);

        for (let i = 0; i < 3; i++) {
            // Si se agotan los boletos de otros participantes, usar los boletos restantes no premiados
            if (backupTicketPool.length === 0) {
                backupTicketPool = poolCopy.filter(
                    (entry) =>
                        entry.ticketNumber !== winTicket &&
                        !backups.some((b) => b.ticketNumber === entry.ticketNumber)
                );
            }
            if (backupTicketPool.length === 0) break;

            const bkIdx = Math.floor(Math.random() * backupTicketPool.length);
            const chosenEntry = backupTicketPool[bkIdx];

            backups.push({
                id: chosenEntry.participant.id,
                name: chosenEntry.participant.fullName,
                dniMasked: maskDni(chosenEntry.participant.dni),
                totalParticipations: chosenEntry.participant.totalParticipations,
                ticketNumber: chosenEntry.ticketNumber,
                announcedAt: new Date().toISOString()
            });

            // Excluir los demás boletos del participante seleccionado para el siguiente puesto de suplente
            backupTicketPool = backupTicketPool.filter(
                (entry) => entry.participant.id !== chosenEntry.participant.id
            );
        }

        const officialWinner: GiveawayWinner = {
            id: selected.id,
            name: selected.fullName,
            dniMasked: maskDni(selected.dni),
            totalParticipations: selected.totalParticipations,
            ticketNumber: winTicket,
            announcedAt: new Date().toISOString()
        };

        setWinner(officialWinner);
        setBackupWinners(backups);
        setPhase("revealing");

        // Tras la animación de revelación, finalizar y persistir en Supabase
        setTimeout(() => {
            setPhase("done");
            playFanfare();
            triggerConfetti();
            recordWinnerAction(giveaway.id, officialWinner, backups);
        }, 1200);
    }

    async function handleReset() {
        setPhase("idle");
        setWinner(null);
        setBackupWinners([]);
        try {
            await resetGiveawayDrawAction(giveaway.id);
        } catch {
            // Error silencioso en reset
        }
    }

    return (
        <main className={styles.livePage}>
            {/* Top Navigation */}
            <nav className={styles.topNav} aria-label="Navegación del Sorteo">
                <Link href={`/sorteos/${giveaway.slug}`} className={styles.backLink}>
                    <ArrowLeft size={16} /> Volver a la Landing del Sorteo
                </Link>

                <Link href="/" className={styles.navLogo} aria-label="Fortuno Inicio">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/icon.png" alt="Fortuno" width={72} height={72} className={styles.logoImg} />
                </Link>

                <div className={styles.liveIndicator}>
                    <span className={styles.livePulseDot} />
                    <span>SALA DE SORTEO EN DIRECTO</span>
                </div>
            </nav>

            <section className={styles.mainContent}>
                {/* 1. Bloque: Escenario de la Tómbola Digital */}
                <section className={styles.stageContainer} aria-label="Tómbola en vivo">
                    {/* Controles de sonido y fullscreen */}
                    <div className={styles.stageControls}>
                        <button
                            type="button"
                            className={styles.iconBtn}
                            onClick={() => setSoundEnabled((v) => !v)}
                            title={soundEnabled ? "Silenciar sonido" : "Activar sonido"}
                        >
                            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                        </button>
                        <button
                            type="button"
                            className={styles.iconBtn}
                            onClick={toggleFullscreen}
                            title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                        >
                            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                        </button>
                    </div>

                    {/* La Tómbola / Bombo */}
                    <div className={styles.tombolaWrapper}>
                        <div className={`${styles.tombolaSphere} ${phase === "spinning" ? styles.tombolaSpinning : ""}`}>
                            <div className={styles.tombolaGrillOverlay} />
                            <div className={styles.chuteCenter} />

                            {/* Pelotas en movimiento */}
                            <div className={styles.ballsContainer}>
                                {visualBalls.map((ticketNum, idx) => {
                                    const color = BALL_COLORS[idx % BALL_COLORS.length];
                                    const animClass = BALL_ANIMS[idx % BALL_ANIMS.length];
                                    return (
                                        <div
                                            key={ticketNum}
                                            className={`${styles.ball} ${animClass} ${phase === "spinning" ? styles.ballSpinning : ""}`}
                                            style={{ "--ball-color": color } as React.CSSProperties}
                                        >
                                            <span className={styles.ballNum}>
                                                {ticketNum.replace(/^FORT\d{3}/, "#")}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className={styles.tombolaStand}>
                            <div className={styles.standPlate} />
                            <div className={styles.standBase} />
                        </div>

                        {/* Pelota ganadora expulsada */}
                        {(phase === "revealing" || phase === "done") && winner && (
                            <div className={styles.winnerExtraction}>
                                <div
                                    className={styles.extractedBall}
                                    style={{ "--ball-color": winnerBallColor } as React.CSSProperties}
                                >
                                    <span className={styles.extractedTicket}>
                                        {winner.ticketNumber}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Zona de Botón de Giro */}
                    <div className={styles.actionZone}>
                        {phase === "idle" && (
                            <button
                                type="button"
                                className={styles.spinBtn}
                                onClick={handleStartDraw}
                                disabled={allTicketEntries.length === 0}
                            >
                                <Play size={20} />
                                Iniciar Sorteo en Vivo
                            </button>
                        )}

                        {phase === "spinning" && (
                            <div className={styles.spinningNotice}>
                                <span className={styles.spinner} />
                                Mezclando tómbola oficial... ¡Eligiendo ganador al azar!
                            </div>
                        )}

                        {phase === "done" && (
                            <button
                                type="button"
                                className={styles.resetBtn}
                                onClick={handleReset}
                            >
                                <RotateCcw size={15} />
                                Repetir Simulación
                            </button>
                        )}
                    </div>

                    {/* Tarjeta del Ganador Oficial */}
                    {phase === "done" && winner && (
                        <div className={styles.winnerCard}>
                            <div className={styles.winnerHeader}>
                                <Trophy size={42} className={styles.trophyIcon} />
                                <div>
                                    <span className={styles.winnerSub}>¡GANADOR OFICIAL DEL SORTEO!</span>
                                    <h2 className={styles.winnerName}>{winner.name}</h2>
                                </div>
                            </div>

                            <div className={styles.winnerDataGrid}>
                                <div>
                                    <span className={styles.dataLabel}>Boleto Ganador</span>
                                    <strong className={styles.ticketBadge}>{winner.ticketNumber}</strong>
                                </div>
                                <div>
                                    <span className={styles.dataLabel}>DNI Certificado</span>
                                    <strong className={styles.dataValue}>{winner.dniMasked}</strong>
                                </div>
                                <div>
                                    <span className={styles.dataLabel}>Total Oportunidades</span>
                                    <strong className={styles.dataValue}>{winner.totalParticipations} participaciones</strong>
                                </div>
                                <div>
                                    <span className={styles.dataLabel}>Premio Adjudicado</span>
                                    <strong className={styles.dataValue}>{giveaway.prize.name}</strong>
                                </div>
                            </div>

                            {backupWinners.length > 0 && (
                                <div className={styles.backupSection}>
                                    <span className={styles.backupTitle}>
                                        <ShieldCheck size={16} /> Suplentes Oficiales (en orden de prelación si el titular no responde):
                                    </span>
                                    <div className={styles.backupList}>
                                        {backupWinners.map((bk, idx) => (
                                            <div key={`${bk.id}-${idx}`} className={styles.backupItem}>
                                                <span className={styles.backupIndex}>#{idx + 1}</span>
                                                <span className={styles.backupName}>{bk.name}</span>
                                                <span className={styles.backupDni}>({bk.dniMasked})</span>
                                                <span className={styles.backupTicket}>{bk.ticketNumber}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                <section className={styles.dataVerification}>
                    {/* 2. Bloque: Datos del sorteo y consulta de participación por DNI */}
                    <header className={styles.giveawaySummaryCard}>
                        <div className={styles.prizeImageCol}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={giveaway.prize.image}
                                alt={giveaway.prize.name}
                                className={styles.prizeImg}
                            />
                            {giveaway.prize.value && (
                                <div className={styles.prizeValueTag}>
                                    Valor: {giveaway.prize.value}
                                </div>
                            )}
                        </div>

                        <div className={styles.prizeInfoCol}>
                            <h1 className={styles.mainTitle}>{giveaway.title}</h1>
                            <p className={styles.mainSubtitle}>{giveaway.subtitle}</p>

                            <div className={styles.metricsBar}>
                                <div className={styles.metricItem}>
                                    <Calendar size={18} className={styles.metricIcon} />
                                    <div>
                                        <span className={styles.metricLabel}>Fecha del Sorteo</span>
                                        <span className={styles.metricVal} suppressHydrationWarning>
                                            {formatFriendlyDateTime(giveaway.drawDate)}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.metricItem}>
                                    <Ticket size={18} className={styles.metricIcon} />
                                    <div>
                                        <span className={styles.metricLabel}>Boletos Emitidos</span>
                                        <span className={styles.metricVal}>{allTickets.length.toLocaleString()} tickets</span>
                                    </div>
                                </div>

                                <div className={styles.metricItem}>
                                    <Users size={18} className={styles.metricIcon} />
                                    <div>
                                        <span className={styles.metricLabel}>Participantes</span>
                                        <span className={styles.metricVal}>{participants.length.toLocaleString()} personas</span>
                                    </div>
                                </div>

                                <div className={styles.metricItem}>
                                    <ShieldCheck size={18} className={styles.metricIcon} />
                                    <div>
                                        <span className={styles.metricLabel}>Certificación</span>
                                        <span className={styles.metricVal}>Auditado en Vivo</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <section className={styles.sectionCard} aria-label="Consulta por DNI">
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionHeaderTitle}>
                                <UserSearch size={20} /> Consulta tu Participación en Vivo
                            </h2>
                            <p className={styles.sectionHeaderDesc}>
                                Ingresa tu DNI para verificar al instante tus boletos asignados y tus opciones de ganar en la base de datos oficial.
                            </p>
                        </div>

                        <form
                            className={styles.dniSearchForm}
                            onSubmit={async (e) => {
                                e.preventDefault();
                                if (dniInput.trim().length < 5) return;
                                setSearchResult("searching");
                                const found = await findParticipantByDniAction(giveaway.id, dniInput.trim());
                                setSearchResult(found ?? "not_found");
                            }}
                        >
                            <input
                                type="text"
                                inputMode="numeric"
                                className={styles.dniInput}
                                placeholder="Ingresa un DNI para consulta"
                                value={dniInput}
                                onChange={(e) => {
                                    setDniInput(e.target.value);
                                    setSearchResult(null);
                                }}
                                maxLength={15}
                                aria-label="Buscar participación por DNI"
                            />
                            <button
                                type="submit"
                                className={styles.dniBtn}
                                disabled={dniInput.trim().length < 5 || searchResult === "searching"}
                            >
                                {searchResult === "searching" ? "Buscando…" : "Consultar DNI"}
                            </button>
                        </form>

                        {/* Mensaje de no encontrado */}
                        {searchResult === "not_found" && (
                            <div className={styles.dniNotFound}>
                                <p>No encontramos ninguna participación con ese DNI en este sorteo.</p>
                                <small>Verifica haber ingresado el mismo documento con el que te registraste.</small>
                            </div>
                        )}

                        {/* Tarjeta de participante encontrado */}
                        {searchResult && searchResult !== "not_found" && searchResult !== "searching" && (() => {
                            const p = searchResult as Participant;
                            return (
                                <div className={styles.dniResultCard}>
                                    <div className={styles.dniResultHeader}>
                                        <div>
                                            <span className={styles.dniResultName}>{maskName(p.fullName)}</span>
                                            <span className={styles.dniResultDni}>DNI: {maskDni(p.dni)}</span>
                                        </div>
                                        <div className={styles.verifiedBadge}>
                                            <CheckCircle2 size={15} /> Participante Verificado
                                        </div>
                                    </div>

                                    <div className={styles.dniBreakdown}>
                                        <div className={styles.dniBreakdownItem}>
                                            <span>Tickets comprados</span>
                                            <strong>{p.paidTickets}</strong>
                                            <small>{p.paidParticipations} participaciones</small>
                                        </div>
                                        <div className={styles.dniBreakdownItem}>
                                            <span>Por referidos</span>
                                            <strong>{p.referralCount} ref.</strong>
                                            <small>+{p.referralParticipations} participaciones</small>
                                        </div>
                                        <div className={styles.dniBreakdownItem}>
                                            <span>Código personal</span>
                                            <strong style={{ color: "#38bdf8" }}>{p.referralCode}</strong>
                                            <small>tu código de referido</small>
                                        </div>
                                        <div className={styles.dniBreakdownItem}>
                                            <span>Total Oportunidades</span>
                                            <strong style={{ color: "#f59e0b" }}>{p.totalParticipations}</strong>
                                            <small>en la tómbola</small>
                                        </div>
                                    </div>

                                    {p.ticketNumbers && p.ticketNumbers.length > 0 && (
                                        <div className={styles.dniTicketsList}>
                                            <span className={styles.dniTicketsLabel}>
                                                <Ticket size={15} /> Tus Boletos Asignados ({p.ticketNumbers.length}):
                                            </span>
                                            <div className={styles.ticketsGrid}>
                                                {p.ticketNumbers.map((tn) => (
                                                    <code key={tn} className={styles.ticketCodeTag}>{tn}</code>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
                    </section>
                </section>
            </section>
        </main>
    );
}
