"use client";

import { useState } from "react";

import Button from "@/app/components/ui/Button/Button";
import Dice from "@/app/components/graphics/Dice/Dice";
import DrawLoader from "@/app/components/feedback/DrawLoader/DrawLoader";
import ResultCard from "@/app/components/ui/ResultCard/ResultCard";

import { useCopyToClipboard } from "@/app/hooks/useCopyToClipboard";
import { getRandomInteger } from "@/app/lib/random";

import styles from "./DiceRoller.module.css";

export default function DiceRoller() {
    const [result, setResult] = useState<number | null>(null);
    const [isRolling, setIsRolling] = useState(false);

    const { copy, hasCopied } = useCopyToClipboard();

    function rollDice() {
        setResult(null);
        setIsRolling(true);

        const diceResult = getRandomInteger(1, 6);

        setTimeout(() => {
            setResult(diceResult);
            setIsRolling(false);
        }, 1500);
    }

    function copyResult() {
        if (result === null) return;
        copy(`Resultado: ${result}`);
    }

    return (
        <div className={styles.diceTool}>
            <Dice value={result} isRolling={isRolling} />

            <Button onClick={rollDice} disabled={isRolling} fullWidth>
                {isRolling ? "Lanzando..." : "Lanzar dado"}
            </Button>

            {isRolling && <DrawLoader text="Lanzando dado..." />}

            {result !== null && !isRolling && (
                <div className={styles.resultGroup}>
                    <ResultCard label="Resultado" celebration="confetti">
                        {result}
                    </ResultCard>

                    <Button variant="secondary" onClick={copyResult} fullWidth>
                        {hasCopied ? "Resultado copiado" : "Copiar resultado"}
                    </Button>
                </div>
            )}
        </div>
    );
}