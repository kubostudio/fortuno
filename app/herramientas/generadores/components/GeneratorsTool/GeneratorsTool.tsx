"use client";

import { useState } from "react";

import Button from "@/app/components/ui/Button/Button";
import DrawLoader from "@/app/components/feedback/DrawLoader/DrawLoader";
import FormField from "@/app/components/ui/FormField/FormField";
import ResultCard from "@/app/components/ui/ResultCard/ResultCard";

import { useCopyToClipboard } from "@/app/hooks/useCopyToClipboard";
import { getRandomInteger, pickRandomItem } from "@/app/lib/random";
import GeneratorTabs from "../GeneratorTabs/GeneratorTabs";

import styles from "./GeneratorsTool.module.css";

export type GeneratorMode = "number" | "letter" | "color";

type GeneratorsToolProps = {
    defaultMode?: GeneratorMode;
};

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function GeneratorsTool({
    defaultMode = "number",
}: GeneratorsToolProps) {
    const mode = defaultMode;
    const [min, setMin] = useState("1");
    const [max, setMax] = useState("100");
    const [result, setResult] = useState("");
    const [colorValue, setColorValue] = useState("");
    const [error, setError] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const { copy, hasCopied } = useCopyToClipboard();

    function generateColor() {
        const color = `#${Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")
            .toUpperCase()}`;

        setColorValue(color);
        return color;
    }

    function generate() {
        setError("");
        setResult("");
        setColorValue("");

        let generatedValue = "";

        if (mode === "number") {
            const minNumber = Number(min);
            const maxNumber = Number(max);

            if (!Number.isFinite(minNumber) || !Number.isFinite(maxNumber)) {
                setError("Ingresa valores numéricos válidos.");
                return;
            }

            if (minNumber > maxNumber) {
                setError("El valor mínimo no puede ser mayor que el máximo.");
                return;
            }

            generatedValue = String(getRandomInteger(minNumber, maxNumber));
        }

        if (mode === "letter") {
            generatedValue = pickRandomItem(LETTERS);
        }

        if (mode === "color") {
            generatedValue = generateColor();
        }

        setIsGenerating(true);

        setTimeout(() => {
            setResult(generatedValue);
            setIsGenerating(false);
        }, 900);
    }

    function copyResult() {
        if (!result) return;
        copy(`Resultado: ${result}`);
    }

    return (
        <div className={styles.tool}>
            <GeneratorTabs activeTab={defaultMode} />

            {mode === "number" && (
                <div className={styles.fields}>
                    <FormField label="Valor mínimo">
                        <input
                            type="number"
                            value={min}
                            onChange={(event) => setMin(event.target.value)}
                            disabled={isGenerating}
                        />
                    </FormField>

                    <FormField label="Valor máximo">
                        <input
                            type="number"
                            value={max}
                            onChange={(event) => setMax(event.target.value)}
                            disabled={isGenerating}
                        />
                    </FormField>
                </div>
            )}

            {mode === "letter" && (
                <div className={styles.infoBox}>
                    Se elegirá una letra aleatoria de la A a la Z.
                </div>
            )}

            {mode === "color" && (
                <div className={styles.infoBox}>
                    Se generará un color aleatorio en formato hexadecimal.
                </div>
            )}

            <Button onClick={generate} disabled={isGenerating} fullWidth>
                {isGenerating ? "Generando..." : "Generar"}
            </Button>

            {error && <p className={styles.error}>{error}</p>}

            {isGenerating && <DrawLoader text="Generando resultado..." />}

            {result && !isGenerating && (
                <div className={styles.resultGroup}>
                    <ResultCard label="Resultado" celebration="confetti">
                        <div className={styles.resultContent}>
                            {mode === "color" && (
                                <span
                                    className={styles.colorPreview}
                                    style={{ backgroundColor: colorValue }}
                                />
                            )}

                            <strong>{result}</strong>
                        </div>
                    </ResultCard>

                    <Button variant="secondary" onClick={copyResult} fullWidth>
                        {hasCopied ? "Resultado copiado" : "Copiar resultado"}
                    </Button>
                </div>
            )}
        </div>
    );
}