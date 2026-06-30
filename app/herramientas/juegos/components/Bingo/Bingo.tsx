"use client";

import { useState } from "react";

import Button from "@/app/components/ui/Button/Button";
import DrawLoader from "@/app/components/feedback/DrawLoader/DrawLoader";
import ResultCard from "@/app/components/ui/ResultCard/ResultCard";
import { getRandomInteger } from "@/app/lib/random";

import styles from "./Bingo.module.css";

type BingoMode = 75 | 90;

export default function Bingo() {
    const [mode, setMode] = useState<BingoMode>(75);
    const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
    const [currentNumber, setCurrentNumber] = useState<number | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const remainingCount = mode - drawnNumbers.length;

    function changeMode(nextMode: BingoMode) {
        setMode(nextMode);
        setDrawnNumbers([]);
        setCurrentNumber(null);
        setIsDrawing(false);
    }

    function drawNumber() {
        if (remainingCount === 0) return;

        setIsDrawing(true);
        setCurrentNumber(null);

        setTimeout(() => {
            let nextNumber = getRandomInteger(1, mode);

            while (drawnNumbers.includes(nextNumber)) {
                nextNumber = getRandomInteger(1, mode);
            }

            setCurrentNumber(nextNumber);
            setDrawnNumbers((current) => [...current, nextNumber]);
            setIsDrawing(false);
        }, 900);
    }

    function resetGame() {
        setDrawnNumbers([]);
        setCurrentNumber(null);
        setIsDrawing(false);
    }

    return (
        <div className={styles.bingo}>
            <div className={styles.modeGrid}>
                <button
                    type="button"
                    className={mode === 75 ? styles.activeMode : ""}
                    onClick={() => changeMode(75)}
                    disabled={isDrawing}
                >
                    Bingo 75
                </button>

                <button
                    type="button"
                    className={mode === 90 ? styles.activeMode : ""}
                    onClick={() => changeMode(90)}
                    disabled={isDrawing}
                >
                    Bingo 90
                </button>
            </div>

            <div className={styles.stats}>
                <div>
                    <strong>{drawnNumbers.length}</strong>
                    <span>Números llamados</span>
                </div>

                <div>
                    <strong>{remainingCount}</strong>
                    <span>Restantes</span>
                </div>
            </div>

            <Button
                onClick={drawNumber}
                disabled={isDrawing || remainingCount === 0}
                fullWidth
            >
                {remainingCount === 0
                    ? "Bingo terminado"
                    : isDrawing
                        ? "Sacando número..."
                        : "Sacar número"}
            </Button>

            {isDrawing && <DrawLoader text="Sacando número..." />}

            {currentNumber !== null && !isDrawing && (
                <ResultCard label="Número" celebration="confetti">
                    {currentNumber}
                </ResultCard>
            )}

            {drawnNumbers.length > 0 && (
                <>
                    <section className={styles.history}>
                        <h3>Números llamados</h3>

                        <div className={styles.numberGrid}>
                            {[...drawnNumbers].reverse().map((number) => (
                                <span key={number}>{number}</span>
                            ))}
                        </div>
                    </section>

                    <Button variant="secondary" onClick={resetGame} fullWidth>
                        Reiniciar bingo
                    </Button>
                </>
            )}
        </div>
    );
}