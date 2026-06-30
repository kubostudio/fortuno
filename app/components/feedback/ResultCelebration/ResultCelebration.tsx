"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

import styles from "./ResultCelebration.module.css";

type ResultCelebrationProps = {
    active?: boolean;
    type?: "confetti" | "winner";
};

export default function ResultCelebration({
    active = false,
    type = "confetti",
}: ResultCelebrationProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!active || !canvasRef.current) return;

        const fire = confetti.create(canvasRef.current, {
            resize: true,
            useWorker: true,
        });

        fire({
            particleCount: type === "winner" ? 120 : 80,
            spread: type === "winner" ? 85 : 70,
            startVelocity: 32,
            ticks: 160,
            origin: {
                x: 0.5,
                y: 0.62,
            },
            colors: ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6"],
            disableForReducedMotion: true,
        });
    }, [active, type]);

    return (
        <canvas
            ref={canvasRef}
            className={styles.canvas}
            aria-hidden="true"
        />
    );
}