"use client";

import { useState } from "react";

import Button from "@/app/components/ui/Button/Button";
import DrawLoader from "@/app/components/feedback/DrawLoader/DrawLoader";
import ResultCard from "@/app/components/ui/ResultCard/ResultCard";
import { pickRandomItem } from "@/app/lib/random";

import styles from "./RockPaperScissors.module.css";

type Move = "Piedra" | "Papel" | "Tijera";

const MOVES: Move[] = ["Piedra", "Papel", "Tijera"];

export default function RockPaperScissors() {
    const [playerMove, setPlayerMove] = useState<Move | "">("");
    const [fortunoMove, setFortunoMove] = useState<Move | "">("");
    const [result, setResult] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);

    function getWinner(player: Move, fortuno: Move) {
        if (player === fortuno) return "Empate";

        if (
            (player === "Piedra" && fortuno === "Tijera") ||
            (player === "Papel" && fortuno === "Piedra") ||
            (player === "Tijera" && fortuno === "Papel")
        ) {
            return "Ganaste";
        }

        return "Ganó Fortuno";
    }

    function play(move: Move) {
        setPlayerMove(move);
        setFortunoMove("");
        setResult("");
        setIsPlaying(true);

        const nextFortunoMove = pickRandomItem(MOVES);

        setTimeout(() => {
            setFortunoMove(nextFortunoMove);
            setResult(getWinner(move, nextFortunoMove));
            setIsPlaying(false);
        }, 900);
    }

    return (
        <div className={styles.game}>
            <div className={styles.options}>
                {MOVES.map((move) => (
                    <button
                        key={move}
                        type="button"
                        className={playerMove === move ? styles.activeOption : ""}
                        onClick={() => play(move)}
                        disabled={isPlaying}
                    >
                        <span>
                            {move === "Piedra" ? "✊" : move === "Papel" ? "✋" : "✌️"}
                        </span>
                        {move}
                    </button>
                ))}
            </div>

            {isPlaying && <DrawLoader text="Fortuno está eligiendo..." />}

            {result && !isPlaying && (
                <div className={styles.resultGroup}>
                    <div className={styles.moves}>
                        <article>
                            <span>Tú elegiste</span>
                            <strong>{playerMove}</strong>
                        </article>

                        <article>
                            <span>Fortuno eligió</span>
                            <strong>{fortunoMove}</strong>
                        </article>
                    </div>

                    <ResultCard
                        label="Resultado"
                        celebration={result === "Ganaste" ? "winner" : "confetti"}
                    >
                        {result}
                    </ResultCard>

                    <Button variant="secondary" onClick={() => setResult("")} fullWidth>
                        Jugar otra vez
                    </Button>
                </div>
            )}
        </div>
    );
}