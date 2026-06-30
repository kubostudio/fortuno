"use client";

import { useState } from "react";

import Button from "@/app/components/ui/Button/Button";
import DrawLoader from "@/app/components/feedback/DrawLoader/DrawLoader";
import ResultCard from "@/app/components/ui/ResultCard/ResultCard";

import { useCopyToClipboard } from "@/app/hooks/useCopyToClipboard";
import { pickRandomItem } from "@/app/lib/random";
import Coin from "@/app/components/graphics/Coin/Coin";

import styles from "./CoinFlipper.module.css";

export default function CoinFlipper() {
    const [result, setResult] = useState("");
    const [isFlipping, setIsFlipping] = useState(false);

    const { copy, hasCopied } = useCopyToClipboard();

    function flipCoin() {
        setResult("");
        setIsFlipping(true);

        const coinResult = pickRandomItem(["Cara", "Sello"]);

        setTimeout(() => {
            setResult(coinResult);
            setIsFlipping(false);
        }, 2300);
    }

    function copyResult() {
        if (!result) return;
        copy(`Resultado: ${result}`);
    }

    return (
        <div className={styles.coinTool}>
            <Coin result={result as "Cara" | "Sello" | ""} isFlipping={isFlipping} />

            <Button onClick={flipCoin} disabled={isFlipping} fullWidth>
                {isFlipping ? "Lanzando..." : "Lanzar moneda"}
            </Button>

            {isFlipping && <DrawLoader text="Lanzando moneda..." />}

            {result && !isFlipping && (
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