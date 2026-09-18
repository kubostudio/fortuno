"use client";

import { FileText, Ticket, Users, Tv, ShieldCheck, X } from "lucide-react";
import styles from "./HowToParticipateModal.module.css";

interface HowToParticipateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStartRegistration?: () => void;
}

export default function HowToParticipateModal({
    isOpen,
    onClose,
    onStartRegistration
}: HowToParticipateModalProps) {
    if (!isOpen) return null;

    const steps = [
        {
            number: "01",
            title: "Regístrate tus datos reales",
            description: "Ingresa tu nombre completo, correo electrónico, DNI y fecha de nacimiento (+18). Tu identidad se verificará al momento de ganar.",
            icon: FileText
        },
        {
            number: "02",
            title: "Compra tickets",
            description: "Cada ticket adquirido suma 3 participaciones directas a tu cuenta, dándote mayores posibilidades de ganar que por referidos.",
            icon: Ticket
        },
        {
            number: "03",
            title: "Refiere amigos",
            description: "Comparte tu código de referido. Por cada 3 amigos que compren su ticket, recibes 1 participación adicional.",
            icon: Users
        },
        {
            number: "04",
            title: "Conéctate a la transmisión en vivo",
            description: "El sorteo se ejecuta en vivo a través de nuestros canales oficiales.",
            icon: Tv
        }
    ];

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
                    <h2 className={styles.title}>¿Cómo participar en los sorteos?</h2>
                    <p className={styles.subtitle}>
                        Todo es transparente, las reglas son claras.
                    </p>
                </div>

                <div className={styles.stepsList}>
                    {steps.map((step) => {
                        const Icon = step.icon;
                        return (
                            <div key={step.number} className={styles.stepCard}>
                                <div className={styles.stepIconBox}>
                                    <Icon size={20} className={styles.iconElement} />
                                </div>
                                <div className={styles.stepContent}>
                                    <h3>{step.title}</h3>
                                    <p>{step.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className={styles.actions}>
                    {onStartRegistration ? (
                        <button
                            type="button"
                            className={styles.btnPrimary}
                            onClick={() => {
                                onClose();
                                onStartRegistration();
                            }}
                        >
                            Comenzar Registro
                        </button>
                    ) : (
                        <button
                            type="button"
                            className={styles.btnPrimary}
                            onClick={onClose}
                        >
                            Cerrar Guía
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
