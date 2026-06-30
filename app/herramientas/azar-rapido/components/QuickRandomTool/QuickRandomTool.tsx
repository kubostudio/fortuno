"use client";

import { useState } from "react";

import CoinFlipper from "@/app/herramientas/lanzar-moneda/components/CoinFlipper/CoinFlipper";
import DiceRoller from "@/app/herramientas/lanzar-dado/components/DiceRoller/DiceRoller";

import styles from "./QuickRandomTool.module.css";

type QuickMode = "coin" | "dice";

export default function QuickRandomTool() {
    const [mode, setMode] = useState<QuickMode>("coin");

    return (
        <div className={styles.tool}>
            <div className={styles.modeGrid}>
                <button
                    type="button"
                    className={mode === "coin" ? styles.activeMode : ""}
                    onClick={() => setMode("coin")}
                >
                    Lanzar moneda
                </button>

                <button
                    type="button"
                    className={mode === "dice" ? styles.activeMode : ""}
                    onClick={() => setMode("dice")}
                >
                    Lanzar dado
                </button>
            </div>

            {mode === "coin" && <CoinFlipper />}
            {mode === "dice" && <DiceRoller />}
        </div>
    );
}