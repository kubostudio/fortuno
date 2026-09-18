"use client";

import { Users, Ticket, ArrowRight, ShieldCheck, Share2, Sparkles, X } from "lucide-react";
import styles from "./ReferralExplainerModal.module.css";

interface ReferralExplainerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onShareClick?: () => void;
}

export default function ReferralExplainerModal({
    isOpen,
    onClose,
    onShareClick
}: ReferralExplainerModalProps) {
    if (!isOpen) return null;

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

                <div className={styles.header}>
                    <h2 className={styles.title}>¿Cómo funciona el Sistema de Referidos?</h2>
                    <p className={styles.subtitle}>
                        En Fortuno premiamos a quienes invitan a sus amigos a participar.
                    </p>
                </div>

                {/* Comparison Grid */}
                <div className={styles.comparisonGrid}>
                    <div className={styles.cardReferrals}>
                        <div className={styles.cardHeader}>
                            <Users className={styles.cardIcon} size={22} />
                            <h3>Invitar Amigos</h3>
                        </div>
                        <div className={styles.ratioBox}>
                            <strong>3 Referidos</strong>
                            <ArrowRight size={16} />
                            <span className={styles.rewardTag}>1 Participación</span>
                        </div>
                        <p className={styles.cardDesc}>
                            Comparte tu enlace personal. Por cada 3 amigos que se registren gratis con tu código en el sorteo, sumas 1 participación adicional en la tómbola.
                        </p>
                    </div>

                    <div className={styles.cardTickets}>
                        <div className={styles.cardHeader}>
                            <Ticket className={styles.ticketIcon} size={22} />
                            <h3>Comprar Tickets</h3>
                        </div>
                        <div className={styles.ratioBox}>
                            <strong>1 Ticket</strong>
                            <ArrowRight size={16} />
                            <span className={styles.boostTag}>3 Participaciones</span>
                        </div>
                        <p className={styles.cardDesc}>
                            Quienes compran tickets tienen una ventaja directa: cada ticket equivale a 3 participaciones automáticas en la tómbola en vivo.
                        </p>
                    </div>
                </div>

                {/* Step List */}
                <div className={styles.stepsSection}>
                    <h4>Pasos para conseguir referidos:</h4>
                    <ol className={styles.stepsList}>
                        <li>
                            <strong>Copia tu enlace personal:</strong> Lo encuentras en la página de cada sorteo una vez registrado.
                        </li>
                        <li>
                            <strong>Compártelo con tus contactos:</strong> Por WhatsApp, Telegram o historias de Instagram/TikTok.
                        </li>
                        <li>
                            <strong>Tus amigos compran tickets:</strong> Al realizar la compra de sus tickets e ingresar tu código de referido quedan automáticamente vinculados a tu cuenta.
                        </li>
                    </ol>
                </div>

                <div className={styles.actions}>
                    {onShareClick ? (
                        <button
                            type="button"
                            className={styles.shareBtn}
                            onClick={() => {
                                onClose();
                                onShareClick();
                            }}
                        >
                            <Share2 size={16} />
                            Copiar Mi Enlace de Referido
                        </button>
                    ) : (
                        <button
                            type="button"
                            className={styles.closeActionBtn}
                            onClick={onClose}
                        >
                            Entendido
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
