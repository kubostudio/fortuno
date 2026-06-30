"use client";

import { useMemo, useState } from "react";

import Button from "@/app/components/ui/Button/Button";
import DrawLoader from "@/app/components/feedback/DrawLoader/DrawLoader";
import FormField from "@/app/components/ui/FormField/FormField";
import ResultCard from "@/app/components/ui/ResultCard/ResultCard";

import { parseLines } from "@/app/lib/random";

import Wheel from "../Wheel/Wheel";
import styles from "./WheelGenerator.module.css";

export default function WheelGenerator() {
    const [names, setNames] = useState("Ana\nLuis\nMaría\nCarlos");
    const [winner, setWinner] = useState("");
    const [error, setError] = useState("");
    const [isSpinning, setIsSpinning] = useState(false);
    const [isRevealing, setIsRevealing] = useState(false);
    const [rotation, setRotation] = useState(0);

    const participants = useMemo(() => parseLines(names), [names]);

    const segmentAngle = 360 / Math.max(participants.length, 1);

    function spinWheel() {
        if (participants.length < 2) {
            setError("Agrega al menos 2 participantes.");
            setWinner("");
            return;
        }

        const winnerIndex = Math.floor(Math.random() * participants.length);
        const targetAngle = winnerIndex * segmentAngle + segmentAngle / 2;
        const extraTurns = 6 + Math.floor(Math.random() * 4);
        const newRotation = rotation + extraTurns * 360 + (360 - targetAngle);

        setError("");
        setWinner("");
        setIsSpinning(true);
        setIsRevealing(false);
        setRotation(newRotation);

        setTimeout(() => {
            setIsSpinning(false);
            setIsRevealing(true);
        }, 4200);

        setTimeout(() => {
            setWinner(participants[winnerIndex]);
            setIsRevealing(false);
        }, 5000);
    }

    return (
        <div className={styles.wheelTool}>
            <FormField label="Participantes" hint="Escribe un nombre por línea.">
                <textarea
                    value={names}
                    onChange={(event) => {
                        setNames(event.target.value);
                        setWinner("");
                    }}
                    rows={8}
                    placeholder="Ana&#10;Luis&#10;María&#10;Carlos"
                    disabled={isSpinning || isRevealing}
                />
            </FormField>

            <div className={styles.summary}>
                <span>{participants.length} participantes</span>
                <span>Un nombre por línea</span>
            </div>

            <Wheel
                participants={participants}
                rotation={rotation}
                isSpinning={isSpinning}
            />

            <Button onClick={spinWheel} disabled={isSpinning || isRevealing} fullWidth>
                {isSpinning ? "Girando..." : "Girar ruleta"}
            </Button>

            {error && <p className={styles.error}>{error}</p>}

            {isRevealing && <DrawLoader text="Preparando resultado..." />}

            {winner && !isSpinning && !isRevealing && (
                <ResultCard label="Ganador" celebration="winner">
                    {winner}
                </ResultCard>
            )}
        </div>
    );
}