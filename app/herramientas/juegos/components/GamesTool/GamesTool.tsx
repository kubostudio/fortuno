"use client";

import { useState } from "react";

import Bingo from "../Bingo/Bingo";
import RockPaperScissors from "../RockPaperScissors/RockPaperScissors";
import TruthOrDare from "../TruthOrDare/TruthOrDare";

import styles from "./GamesTool.module.css";

type GameMode = "rps" | "bingo" | "truthOrDare";

export default function GamesTool() {
    const [mode, setMode] = useState<GameMode>("rps");

    return (
        <div className={styles.tool}>
            <div className={styles.modeGrid}>
                <button
                    type="button"
                    className={mode === "rps" ? styles.activeMode : ""}
                    onClick={() => setMode("rps")}
                >
                    Piedra, papel o tijera
                </button>

                <button
                    type="button"
                    className={mode === "bingo" ? styles.activeMode : ""}
                    onClick={() => setMode("bingo")}
                >
                    Bingo
                </button>

                <button
                    type="button"
                    className={mode === "truthOrDare" ? styles.activeMode : ""}
                    onClick={() => setMode("truthOrDare")}
                >
                    Verdad o reto
                </button>
            </div>

            {mode === "rps" && <RockPaperScissors />}
            {mode === "bingo" && <Bingo />}
            {mode === "truthOrDare" && <TruthOrDare />}
        </div>
    );
}