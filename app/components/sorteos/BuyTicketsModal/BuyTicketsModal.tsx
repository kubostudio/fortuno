"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { Ticket, Plus, Minus, CheckCircle2, ShieldCheck, Zap, X } from "lucide-react";
import { Giveaway, Participant } from "@/app/lib/types/giveaway";
import { buyTicketsAction } from "@/app/actions/giveaways";
import styles from "./BuyTicketsModal.module.css";

interface BuyTicketsModalProps {
    giveaway: Giveaway;
    participant: Participant;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (updatedParticipant: Participant) => void;
}

export default function BuyTicketsModal({
    giveaway,
    participant,
    isOpen,
    onClose,
    onSuccess
}: BuyTicketsModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const totalPrice = quantity * giveaway.ticketPrice;
    const totalParticipationsGained = quantity * 3; // 1 ticket = 3 participaciones

    function handleIncrement() {
        if (giveaway.maxTickets && (giveaway.ticketsSold + quantity) >= giveaway.maxTickets) return;
        setQuantity((prev) => prev + 1);
    }

    function handleDecrement() {
        setQuantity((prev) => Math.max(1, prev - 1));
    }

    async function handleBuy() {
        setIsProcessing(true);
        setError(null);

        try {
            const result = await buyTicketsAction(giveaway.id, participant.id, quantity);
            if (result.success && result.participant) {
                try {
                    confetti({
                        particleCount: 100,
                        spread: 80,
                        origin: { y: 0.6 }
                    });
                } catch {
                    // Ignore if canvas-confetti is not loaded
                }

                setIsSuccess(true);
                onSuccess(result.participant);
            } else {
                setError(result.message || "Error al procesar la compra.");
            }
        } catch {
            setError("Ocurrió un error inesperado al procesar la compra.");
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button
                    type="button"
                    className={styles.closeBtn}
                    onClick={onClose}
                    aria-label="Cerrar modal"
                >
                    <X size={18} />
                </button>

                {!isSuccess ? (
                    <>
                        <div className={styles.header}>
                            <span className={styles.badge}>
                                <Zap size={14} /> Multiplicador Oficial
                            </span>
                            <h2 className={styles.title}>Comprar Tickets para el Sorteo</h2>
                            <p className={styles.subtitle}>
                                <strong>1 Ticket = 3 Participaciones</strong> en la tómbola del sorteo.
                            </p>
                        </div>

                        {error && (
                            <div className={styles.errorAlert} role="alert">
                                {error}
                            </div>
                        )}

                        <div className={styles.priceCard}>
                            <div className={styles.giveawayHeader}>
                                <div>
                                    <span className={styles.giveawayLabel}>Sorteo:</span>
                                    <strong className={styles.giveawayTitle}>{giveaway.title}</strong>
                                </div>
                                <div className={styles.unitPriceBadge}>
                                    ${giveaway.ticketPrice} {giveaway.currency} / ticket
                                </div>
                            </div>

                            <div className={styles.counterRow}>
                                <span className={styles.counterLabel}>Cantidad de Tickets:</span>
                                <div className={styles.counterControl}>
                                    <button
                                        type="button"
                                        className={styles.counterBtn}
                                        onClick={handleDecrement}
                                        disabled={quantity <= 1 || isProcessing}
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className={styles.counterValue}>{quantity}</span>
                                    <button
                                        type="button"
                                        className={styles.counterBtn}
                                        onClick={handleIncrement}
                                        disabled={isProcessing}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className={styles.presetButtons}>
                                {[1, 3, 5, 10].map((preset) => (
                                    <button
                                        key={preset}
                                        type="button"
                                        className={`${styles.presetBtn} ${quantity === preset ? styles.activePreset : ""}`}
                                        onClick={() => setQuantity(preset)}
                                    >
                                        {preset} {preset === 1 ? "Ticket" : "Tickets"}
                                    </button>
                                ))}
                            </div>

                            <div className={styles.summaryBox}>
                                <div className={styles.summaryItem}>
                                    <span>Participaciones que sumas:</span>
                                    <strong className={styles.participationsHighlight}>
                                        +{totalParticipationsGained} Participaciones
                                    </strong>
                                </div>
                                <div className={styles.summaryItem}>
                                    <span>Total a pagar:</span>
                                    <strong className={styles.totalPrice}>
                                        ${totalPrice} {giveaway.currency}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <div className={styles.trustRow}>
                            <ShieldCheck size={16} className={styles.trustIcon} />
                            <span>Transacción cifrada y protegida. Asignación inmediata de participaciones.</span>
                        </div>

                        <button
                            type="button"
                            className={styles.payBtn}
                            onClick={handleBuy}
                            disabled={isProcessing}
                        >
                            <Ticket size={18} />
                            {isProcessing ? "Procesando pago..." : `Confirmar y Pagar $${totalPrice} ${giveaway.currency}`}
                        </button>
                    </>
                ) : (
                    <div className={styles.successState}>
                        <div className={styles.successIconWrapper}>
                            <CheckCircle2 size={48} className={styles.successCheckIcon} />
                        </div>
                        <h2 className={styles.successTitle}>¡Compra de Tickets Completada!</h2>
                        <p className={styles.successSubtitle}>
                            Se han sumado <strong>+{totalParticipationsGained} participaciones</strong> a tu cuenta.
                        </p>

                        <div className={styles.newBalanceCard}>
                            <span>Tus Participaciones Actuales:</span>
                            <strong>{participant.totalParticipations + totalParticipationsGained}</strong>
                            <small>Tienes muchas más posibilidades de ganar en el sorteo en vivo.</small>
                        </div>

                        <button
                            type="button"
                            className={styles.closeSuccessBtn}
                            onClick={onClose}
                        >
                            Volver al Sorteo
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
