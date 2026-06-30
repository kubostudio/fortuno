"use client";

import { useState } from "react";

import Button from "@/app/components/ui/Button/Button";
import DrawLoader from "@/app/components/feedback/DrawLoader/DrawLoader";
import FormField from "@/app/components/ui/FormField/FormField";
import ResultCard from "@/app/components/ui/ResultCard/ResultCard";
import { useCopyToClipboard } from "@/app/hooks/useCopyToClipboard";
import { parseLines, pickUniqueItems } from "@/app/lib/random";

import styles from "./DrawsTool.module.css";

type DrawMode = "names" | "prizes";

type DrawsToolProps = {
    defaultMode?: DrawMode;
};

export default function DrawsTool({ defaultMode = "names" }: DrawsToolProps) {
    const [mode, setMode] = useState<DrawMode>(defaultMode);
    const [participantsText, setParticipantsText] = useState(
        "Ana\nLuis\nMaría\nCarlos\nLucía"
    );
    const [prizesText, setPrizesText] = useState("Premio 1\nPremio 2\nPremio 3");
    const [winnerCount, setWinnerCount] = useState("1");
    const [removePreviousWinners, setRemovePreviousWinners] = useState(false);

    const [previousWinners, setPreviousWinners] = useState<string[]>([]);
    const [results, setResults] = useState<string[]>([]);
    const [prizeResults, setPrizeResults] = useState<
        { prize: string; winner: string }[]
    >([]);

    const [error, setError] = useState("");
    const [isDrawing, setIsDrawing] = useState(false);

    const { copy, hasCopied } = useCopyToClipboard();

    const participants = parseLines(participantsText);
    const availableParticipants = removePreviousWinners
        ? participants.filter((name) => !previousWinners.includes(name))
        : participants;

    const prizes = parseLines(prizesText);

    function resetResults() {
        setResults([]);
        setPrizeResults([]);
        setError("");
    }

    function changeMode(nextMode: DrawMode) {
        setMode(nextMode);
        resetResults();
    }

    function draw() {
        resetResults();

        if (participants.length < 2) {
            setError("Agrega al menos 2 participantes.");
            return;
        }

        if (availableParticipants.length < 1) {
            setError("Ya no quedan participantes disponibles para sortear.");
            return;
        }

        setIsDrawing(true);

        setTimeout(() => {
            if (mode === "names") {
                drawNames();
            }

            if (mode === "prizes") {
                drawPrizes();
            }

            setIsDrawing(false);
        }, 1200);
    }

    function drawNames() {
        const count = Number(winnerCount);

        if (!Number.isInteger(count) || count < 1) {
            setError("Ingresa una cantidad válida de ganadores.");
            return;
        }

        if (count > availableParticipants.length) {
            setError("La cantidad de ganadores supera los participantes disponibles.");
            return;
        }

        const winners = pickUniqueItems(availableParticipants, count);

        setResults(winners);

        if (removePreviousWinners) {
            setPreviousWinners((current) => [...current, ...winners]);
        }
    }

    function drawPrizes() {
        if (prizes.length < 1) {
            setError("Agrega al menos 1 premio.");
            return;
        }

        if (prizes.length > availableParticipants.length) {
            setError("Hay más premios que participantes disponibles.");
            return;
        }

        const winners = pickUniqueItems(availableParticipants, prizes.length);

        const assignments = prizes.map((prize, index) => ({
            prize,
            winner: winners[index],
        }));

        setPrizeResults(assignments);

        if (removePreviousWinners) {
            setPreviousWinners((current) => [...current, ...winners]);
        }
    }

    function clearPreviousWinners() {
        setPreviousWinners([]);
        resetResults();
    }

    function copyResults() {
        if (mode === "prizes") {
            const text = prizeResults
                .map((item, index) => `${index + 1}. ${item.prize}: ${item.winner}`)
                .join("\n");

            copy(`Resultados del sorteo:\n${text}`);
            return;
        }

        const title = "Ganadores";
        const text = results
            .map((result, index) => `${index + 1}. ${result}`)
            .join("\n");

        copy(`${title}:\n${text}`);
    }

    const hasResult = results.length > 0 || prizeResults.length > 0;

    return (
        <div className={styles.tool}>
            <div className={styles.modeGrid}>
                <button
                    type="button"
                    className={mode === "names" ? styles.activeMode : ""}
                    onClick={() => changeMode("names")}
                >
                    Nombres
                </button>

                <button
                    type="button"
                    className={mode === "prizes" ? styles.activeMode : ""}
                    onClick={() => changeMode("prizes")}
                >
                    Premios
                </button>
            </div>

            <FormField label="Participantes" hint="Escribe un nombre por línea.">
                <textarea
                    value={participantsText}
                    onChange={(event) => {
                        setParticipantsText(event.target.value);
                        resetResults();
                    }}
                    rows={8}
                    placeholder="Ana&#10;Luis&#10;María&#10;Carlos"
                    disabled={isDrawing}
                />
            </FormField>

            {mode === "prizes" && (
                <FormField label="Premios" hint="Escribe un premio por línea.">
                    <textarea
                        value={prizesText}
                        onChange={(event) => {
                            setPrizesText(event.target.value);
                            resetResults();
                        }}
                        rows={5}
                        placeholder="Audífonos&#10;Gift card&#10;Entrada al cine"
                        disabled={isDrawing}
                    />
                </FormField>
            )}

            {mode !== "prizes" && (
                <FormField
                    label="Cantidad de ganadores"
                >
                    <input
                        type="number"
                        min="1"
                        value={winnerCount}
                        onChange={(event) => {
                            setWinnerCount(event.target.value);
                            resetResults();
                        }}
                        disabled={isDrawing}
                    />
                </FormField>
            )}

            <label className={styles.checkOption}>
                <input
                    type="checkbox"
                    checked={removePreviousWinners}
                    onChange={(event) => {
                        setRemovePreviousWinners(event.target.checked);
                        resetResults();
                    }}
                    disabled={isDrawing}
                />
                <span>Eliminar ganadores anteriores de próximos sorteos</span>
            </label>

            <div className={styles.summaryGrid}>
                <div>
                    <strong>{participants.length}</strong>
                    <span>Participantes</span>
                </div>

                <div>
                    <strong>{availableParticipants.length}</strong>
                    <span>Disponibles</span>
                </div>

                {previousWinners.length > 0 && (
                    <div>
                        <strong>{previousWinners.length}</strong>
                        <span>Ya ganaron</span>
                    </div>
                )}
            </div>

            {previousWinners.length > 0 && (
                <Button variant="secondary" onClick={clearPreviousWinners} fullWidth>
                    Reiniciar ganadores anteriores
                </Button>
            )}

            <Button onClick={draw} disabled={isDrawing} fullWidth>
                {isDrawing ? "Sorteando..." : "Realizar sorteo"}
            </Button>

            {error && <p className={styles.error}>{error}</p>}

            {isDrawing && <DrawLoader text="Escogiendo resultado..." />}

            {hasResult && !isDrawing && (
                <div className={styles.resultGroup}>
                    <ResultCard
                        label={mode === "prizes" ? "Premios asignados" : "Resultado"}
                        celebration="winner"
                        size={mode === "prizes" ? "compact" : "large"}
                    >
                        {mode === "prizes" ? (
                            <ol className={styles.prizeList}>
                                {prizeResults.map((item, index) => (
                                    <li key={`${item.prize}-${item.winner}-${index}`}>
                                        <span>{item.prize}</span>
                                        <strong>{item.winner}</strong>
                                    </li>
                                ))}
                            </ol>
                        ) : (
                            <ol className={styles.resultList}>
                                {results.map((item, index) => (
                                    <li key={`${item}-${index}`}>{item}</li>
                                ))}
                            </ol>
                        )}
                    </ResultCard>

                    <Button variant="secondary" onClick={copyResults} fullWidth>
                        {hasCopied ? "Resultado copiado" : "Copiar resultado"}
                    </Button>
                </div>
            )}
        </div>
    );
}