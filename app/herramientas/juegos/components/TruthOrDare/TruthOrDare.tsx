"use client";

import { useState } from "react";

import Button from "@/app/components/ui/Button/Button";
import DrawLoader from "@/app/components/feedback/DrawLoader/DrawLoader";
import FormField from "@/app/components/ui/FormField/FormField";
import ResultCard from "@/app/components/ui/ResultCard/ResultCard";
import { parseLines, pickRandomItem } from "@/app/lib/random";

import { TRUTHS } from "../../data/truths";
import { DARES } from "../../data/dares";

import styles from "./TruthOrDare.module.css";

type Choice = "truth" | "dare";

export default function TruthOrDare() {
    const [customTruths, setCustomTruths] = useState("");
    const [customDares, setCustomDares] = useState("");
    const [choice, setChoice] = useState<Choice | null>(null);
    const [result, setResult] = useState("");
    const [isChoosing, setIsChoosing] = useState(false);

    const truths = [...TRUTHS, ...parseLines(customTruths)];
    const dares = [...DARES, ...parseLines(customDares)];

    function play() {
        setChoice(null);
        setResult("");
        setIsChoosing(true);

        setTimeout(() => {
            const nextChoice = pickRandomItem<Choice>(["truth", "dare"]);
            const nextResult =
                nextChoice === "truth" ? pickRandomItem(truths) : pickRandomItem(dares);

            setChoice(nextChoice);
            setResult(nextResult);
            setIsChoosing(false);
        }, 1000);
    }

    return (
        <div className={styles.game}>
            <div className={styles.infoBox}>
                Fortuno sorteará primero entre <strong>verdad</strong> y{" "}
                <strong>reto</strong>, luego mostrará una opción aleatoria.
            </div>

            <div className={styles.customGrid}>
                <FormField label="Verdades extra" hint="Opcional. Una verdad por línea.">
                    <textarea
                        value={customTruths}
                        onChange={(event) => setCustomTruths(event.target.value)}
                        rows={4}
                        placeholder="¿Cuál fue tu mayor miedo de niño?"
                        disabled={isChoosing}
                    />
                </FormField>

                <FormField label="Retos extra" hint="Opcional. Un reto por línea.">
                    <textarea
                        value={customDares}
                        onChange={(event) => setCustomDares(event.target.value)}
                        rows={4}
                        placeholder="Baila durante 10 segundos"
                        disabled={isChoosing}
                    />
                </FormField>
            </div>

            <Button onClick={play} disabled={isChoosing} fullWidth>
                {isChoosing ? "Sorteando..." : "Sortear verdad o reto"}
            </Button>

            {isChoosing && <DrawLoader text="Sorteando verdad o reto..." />}

            {result && !isChoosing && (
                <ResultCard
                    label={choice === "truth" ? "Verdad" : "Reto"}
                    celebration="confetti"
                    size="compact"
                >
                    <p className={styles.resultText}>{result}</p>
                </ResultCard>
            )}
        </div>
    );
}