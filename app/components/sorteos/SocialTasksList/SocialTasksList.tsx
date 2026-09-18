"use client";

import { useState } from "react";
import { ExternalLink, CheckCircle2, Clock, Camera, Tv, Video, Share2, ShieldAlert, AtSign } from "lucide-react";
import { SocialAction, Participant } from "@/app/lib/types/giveaway";
import { completeSocialActionAction } from "@/app/actions/giveaways";
import styles from "./SocialTasksList.module.css";

interface SocialTasksListProps {
    giveawayId: string;
    socialActions: SocialAction[];
    participant: Participant | null;
    onActionCompleted: (updatedParticipant: Participant) => void;
    onNeedRegistration: () => void;
}

export default function SocialTasksList({
    giveawayId,
    socialActions,
    participant,
    onActionCompleted,
    onNeedRegistration
}: SocialTasksListProps) {
    const [activeActionId, setActiveActionId] = useState<string | null>(null);
    const [countdown, setCountdown] = useState<number>(0);
    const [handleInput, setHandleInput] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    function getPlatformIcon(platform: SocialAction["platform"]) {
        switch (platform) {
            case "instagram":
                return <Camera size={18} className={styles.igIcon} />;
            case "youtube":
                return <Tv size={18} className={styles.ytIcon} />;
            case "tiktok":
                return <Video size={18} className={styles.ttIcon} />;
            case "x":
                return <AtSign size={18} className={styles.xIcon} />;
            default:
                return <Share2 size={18} />;
        }
    }

    function handleStartAction(action: SocialAction) {
        if (!participant) {
            onNeedRegistration();
            return;
        }

        if (participant.completedSocialActionIds.includes(action.id)) {
            return;
        }

        // Abrir URL oficial en nueva pestaña
        window.open(action.url, "_blank", "noopener,noreferrer");

        setActiveActionId(action.id);
        setHandleInput("");
        setError(null);
        setCountdown(6);

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }

    async function handleConfirmHandle(actionId: string) {
        if (!participant) {
            onNeedRegistration();
            return;
        }

        if (!handleInput.trim()) {
            setError("Por favor ingresa tu @usuario de la red social para auditar.");
            return;
        }

        const formattedHandle = handleInput.trim().startsWith("@")
            ? handleInput.trim()
            : `@${handleInput.trim()}`;

        const result = await completeSocialActionAction(giveawayId, participant.id, actionId, formattedHandle);

        if (result.success && result.participant) {
            onActionCompleted(result.participant);
            setActiveActionId(null);
            setHandleInput("");
        } else {
            setError("No se pudo registrar la acción.");
        }
    }

    if (socialActions.length === 0) return null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>Tareas de Redes Sociales</h3>
                <span className={styles.bonusTag}>+1 a +2 Participaciones Extra</span>
            </div>

            <p className={styles.subtitle}>
                Completa estas acciones para sumar participaciones directas a tu cuenta. El organizador auditará tu usuario antes de la entrega del premio.
            </p>

            <div className={styles.taskList}>
                {socialActions.map((action) => {
                    const isCompleted = participant?.completedSocialActionIds.includes(action.id);
                    const isCurrent = activeActionId === action.id;

                    return (
                        <div
                            key={action.id}
                            className={`${styles.taskCard} ${isCompleted ? styles.completedCard : ""}`}
                        >
                            <div className={styles.taskMainRow}>
                                <div className={styles.iconWrapper}>
                                    {getPlatformIcon(action.platform)}
                                </div>

                                <div className={styles.taskInfo}>
                                    <h4>{action.title}</h4>
                                    <p>{action.description}</p>
                                </div>

                                <div className={styles.taskRightAction}>
                                    {isCompleted ? (
                                        <span className={styles.completedBadge}>
                                            <CheckCircle2 size={16} /> Completado (+{action.bonusParticipations})
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            className={styles.actionBtn}
                                            onClick={() => handleStartAction(action)}
                                            disabled={isCurrent}
                                        >
                                            <span className={styles.pointsBadge}>+{action.bonusParticipations}</span>
                                            Seguir
                                            <ExternalLink size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Verification form dropdown */}
                            {isCurrent && (
                                <div className={styles.verifyBox}>
                                    {countdown > 0 ? (
                                        <div className={styles.countdownBox}>
                                            <Clock size={16} className={styles.clockIcon} />
                                            <span>
                                                Verificando seguimiento... espera <strong>{countdown}s</strong>
                                            </span>
                                        </div>
                                    ) : (
                                        <div className={styles.handleInputBox}>
                                            <label htmlFor={`handle-${action.id}`}>
                                                Ingresa tu usuario de {action.platform} para verificar:
                                            </label>
                                            <div className={styles.inputGroup}>
                                                <input
                                                    id={`handle-${action.id}`}
                                                    type="text"
                                                    placeholder="@tu_usuario"
                                                    value={handleInput}
                                                    onChange={(e) => setHandleInput(e.target.value)}
                                                    autoFocus
                                                />
                                                <button
                                                    type="button"
                                                    className={styles.confirmBtn}
                                                    onClick={() => handleConfirmHandle(action.id)}
                                                >
                                                    Confirmar
                                                </button>
                                                <button
                                                    type="button"
                                                    className={styles.cancelBtn}
                                                    onClick={() => setActiveActionId(null)}
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                            {error && <span className={styles.errorMsg}>{error}</span>}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className={styles.notice}>
                <ShieldAlert size={14} />
                <span>Si el ganador no cumple con los seguimientos registrados, el premio pasará automáticamente a los suplentes.</span>
            </div>
        </div>
    );
}
