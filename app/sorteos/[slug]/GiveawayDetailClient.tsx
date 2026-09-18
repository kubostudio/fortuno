"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Ticket,
    Users,
    Calendar,
    Check,
    HelpCircle,
    Sparkles,
    Shield,
    ChevronRight
} from "lucide-react";
import { Giveaway, Participant } from "@/app/lib/types/giveaway";
import { findParticipantByDniAction } from "@/app/actions/giveaways";
import { formatFriendlyDateTime } from "@/app/lib/utils/date";
import RegisterModal from "@/app/components/sorteos/RegisterModal/RegisterModal";
import HowToParticipateModal from "@/app/components/sorteos/HowToParticipateModal/HowToParticipateModal";
import styles from "./page.module.css";

interface GiveawayDetailClientProps {
    giveaway: Giveaway;
}

/**
 * Enmascara el DNI mostrando solo los últimos 5 dígitos.
 * Ej: "72194821" → "***94821"
 */
function maskDni(dni: string): string {
    if (dni.length <= 5) return `***${dni}`;
    const visible = dni.slice(-5);
    return `${"*".repeat(dni.length - 5)}${visible}`;
}

/**
 * Formatea el nombre para la lista pública.
 * Formato: PrimerApellido I., PrimerNombre I.
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

export default function GiveawayDetailClient({ giveaway }: GiveawayDetailClientProps) {
    const [activeTab, setActiveTab] = useState<"detalle" | "participantes">("detalle");
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isHowToOpen, setIsHowToOpen] = useState(false);
    const [referralCodeFromUrl, setReferralCodeFromUrl] = useState("");

    // Buscador por DNI conectado a Supabase
    const [dniInput, setDniInput] = useState("");
    const [searchResult, setSearchResult] = useState<Participant | null | "not_found" | "searching">(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const ref = urlParams.get("ref");
        if (ref) setReferralCodeFromUrl(ref);
    }, []);

    return (
        <main className={styles.container}>
            {/* Breadcrumbs */}
            <nav className={styles.breadcrumbs} aria-label="Ruta de navegación">
                <Link href="/sorteos" className={styles.backBreadcrumb}>
                    <ArrowLeft size={15} /> Sorteos
                </Link>
                <span className={styles.breadSep}>/</span>
                <span className={styles.currentBreadcrumb}>{giveaway.title}</span>
            </nav>

            {/* Hero Grid */}
            <div className={styles.heroGrid}>
                {/* Columna imagen */}
                <div className={styles.mediaColumn}>
                    <div className={styles.imageCard}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={giveaway.prize.image} alt={giveaway.prize.name} className={styles.prizeImage} />
                        <span className={`${styles.statusTag} ${styles[giveaway.status]}`}>
                            {giveaway.status === "active" && "Activo"}
                            {giveaway.status === "upcoming" && "Próximamente"}
                            {giveaway.status === "paused" && "Pausado"}
                            {giveaway.status === "completed" && "Finalizado"}
                        </span>
                        {giveaway.prize.value && (
                            <span className={styles.priceTag}>
                                Valor: {giveaway.prize.value}
                            </span>
                        )}
                    </div>

                    {/* Mini stats */}
                    <div className={styles.miniStats}>
                        <div className={styles.miniStatItem}>
                            <Calendar size={14} className={styles.miniStatIcon} />
                            <div>
                                <span className={styles.miniStatLabel}>Fecha sorteo</span>
                                <strong className={styles.miniStatVal} suppressHydrationWarning>
                                    {formatFriendlyDateTime(giveaway.drawDate)}
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Columna info */}
                <div className={styles.infoColumn}>
                    {referralCodeFromUrl && (
                        <div className={styles.referralBanner}>
                            <Sparkles size={16} />
                            <span>
                                Fuiste invitado con el código <strong>{referralCodeFromUrl}</strong>.
                                Al registrarte quedarás vinculado y tu amigo acumulará referidos.
                            </span>
                        </div>
                    )}

                    {/* Título y descripción */}
                    <h1 className={styles.title}>{giveaway.title}</h1>
                    <p className={styles.subtitle}>{giveaway.subtitle}</p>

                    {/* Premio */}
                    {giveaway.prize.details && (
                        <div className={styles.prizeCard}>
                            <div className={styles.prizeCardHeader}>
                                <span>Lo que incluye este premio</span>
                            </div>
                            <ul className={styles.prizeList}>
                                {giveaway.prize.details.map((detail, idx) => (
                                    <li key={idx}>
                                        <Check size={14} className={styles.checkIcon} />
                                        <span>{detail}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* CTA único para todos */}
                    <div className={styles.ctaBlock}>
                        {giveaway.status === "active" || giveaway.status === "upcoming" ? (
                            <>
                                <button
                                    type="button"
                                    className={styles.howBtn}
                                    onClick={() => setIsHowToOpen(true)}
                                >
                                    <HelpCircle size={14} /> ¿Cómo funciona?
                                </button>
                                <button
                                    type="button"
                                    className={styles.mainCtaBtn}
                                    onClick={() => setIsRegisterOpen(true)}
                                >
                                    <Ticket size={18} />
                                    Participar en el Sorteo
                                    <span className={styles.ctaPrice}>${giveaway.ticketPrice} {giveaway.currency}</span>
                                </button>
                            </>
                        ) : giveaway.status === "paused" ? (
                            <div className={styles.completedNotice}>
                                <h3>Sorteo no disponible por ahora</h3>
                                <p>Este sorteo se encuentra temporalmente pausado.</p>
                                <Link href="/sorteos" className={styles.moreGiveawaysLink}>
                                    Ver otros sorteos activos <ChevronRight size={14} />
                                </Link>
                            </div>
                        ) : (
                            <div className={styles.completedNotice}>
                                <h3>Este sorteo ya concluyó</h3>
                                {giveaway.winner && (
                                    <p>
                                        Ganador oficial: <strong>{giveaway.winner.name}</strong>
                                        <br /><small>DNI: {giveaway.winner.dniMasked}</small>
                                    </p>
                                )}
                                <Link href="/sorteos" className={styles.moreGiveawaysLink}>
                                    Ver sorteos activos <ChevronRight size={14} />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs: Detalle / Participantes */}
            <div className={styles.tabsContainer}>
                <div className={styles.tabsBar} role="tablist">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "detalle"}
                        className={`${styles.tabBtn} ${activeTab === "detalle" ? styles.tabActive : ""}`}
                        onClick={() => setActiveTab("detalle")}
                    >
                        Reglas y condiciones
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "participantes"}
                        className={`${styles.tabBtn} ${activeTab === "participantes" ? styles.tabActive : ""}`}
                        onClick={() => setActiveTab("participantes")}
                    >
                        <Users size={14} /> Participantes
                    </button>
                </div>

                {/* Tab: Detalle */}
                {activeTab === "detalle" && (
                    <div className={styles.tabPanel}>
                        <div className={styles.rulesBlock}>
                            <h3 className={styles.rulesTitle}>Reglas y Condiciones Oficiales</h3>
                            {giveaway.description && (
                                <p className={styles.rulesDesc}>{giveaway.description}</p>
                            )}
                            {giveaway.rules && (
                                <ul className={styles.rulesList}>
                                    {giveaway.rules.map((rule, idx) => (
                                        <li key={idx}>
                                            <span className={styles.ruleNum}>{idx + 1}</span>
                                            {rule}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}

                {/* Tab: Participantes — buscador por DNI */}
                {activeTab === "participantes" && (
                    <div className={styles.tabPanel}>
                        <div className={styles.dniSearchHeader}>
                            <h3 className={styles.participantsTitle}>Consulta tu participación</h3>
                            <p className={styles.participantsNote}>
                                <Shield size={12} /> Ingresa tu DNI para ver tus datos en la base de datos oficial de Fortuno.
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
                                className={styles.dniSearchInput}
                                placeholder="Ingresa tu DNI o los últimos 5 dígitos"
                                value={dniInput}
                                onChange={(e) => {
                                    setDniInput(e.target.value);
                                    setSearchResult(null);
                                }}
                                maxLength={15}
                                aria-label="DNI para buscar participación"
                            />
                            <button
                                type="submit"
                                className={styles.dniSearchBtn}
                                disabled={dniInput.trim().length < 5 || searchResult === "searching"}
                            >
                                {searchResult === "searching" ? "Buscando…" : "Buscar"}
                            </button>
                        </form>

                        {/* Resultado */}
                        {searchResult === "not_found" && (
                            <div className={styles.dniNotFound}>
                                <Shield size={28} />
                                <p>No encontramos ninguna participación con ese DNI en este sorteo.</p>
                                <small>Verifica que el DNI ingresado es el que usaste al registrarte.</small>
                            </div>
                        )}

                        {searchResult && searchResult !== "not_found" && searchResult !== "searching" && (() => {
                            const p = searchResult as Participant;
                            return (
                                <div className={styles.dniResultCard}>
                                    <div className={styles.dniResultHeader}>
                                        <div className={styles.dniResultMeta}>
                                            <span className={styles.dniResultName}>{maskName(p.fullName)}</span>
                                            <span className={styles.dniResultDni}>DNI: {maskDni(p.dni)}</span>
                                        </div>
                                        <div className={styles.dniResultBadge}>
                                            <Shield size={14} /> Participante Verificado
                                        </div>
                                    </div>

                                    {/* Desglose de participaciones */}
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
                                            <span>Código de referido</span>
                                            <strong className={styles.referralCodeVal}>{p.referralCode}</strong>
                                            <small>tu código personal</small>
                                        </div>
                                        <div className={`${styles.dniBreakdownItem} ${styles.dniTotal}`}>
                                            <span>Total</span>
                                            <strong>{p.totalParticipations}</strong>
                                            <small>participaciones</small>
                                        </div>
                                    </div>

                                    {/* Números de ticket */}
                                    {p.ticketNumbers && p.ticketNumbers.length > 0 && (
                                        <div className={styles.dniTickets}>
                                            <p className={styles.dniTicketsLabel}>
                                                <Ticket size={13} /> Tus números de ticket ({p.ticketNumbers.length}):
                                            </p>
                                            <div className={styles.dniTicketsList}>
                                                {p.ticketNumbers.map((tn) => (
                                                    <code key={tn} className={styles.dniTicketNum}>{tn}</code>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
                    </div>
                )}

            </div>

            {/* Modals */}
            <RegisterModal
                giveaway={giveaway}
                isOpen={isRegisterOpen}
                initialReferralCode={referralCodeFromUrl}
                onClose={() => setIsRegisterOpen(false)}
            />

            <HowToParticipateModal
                isOpen={isHowToOpen}
                onClose={() => setIsHowToOpen(false)}
                onStartRegistration={() => setIsRegisterOpen(true)}
            />
        </main>
    );
}
