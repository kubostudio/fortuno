import styles from "./Dice.module.css";

type DiceProps = {
    value?: number | null;
    isRolling?: boolean;
};

const DOTS_BY_VALUE: Record<number, string[]> = {
    1: ["center"],
    2: ["topLeft", "bottomRight"],
    3: ["topLeft", "center", "bottomRight"],
    4: ["topLeft", "topRight", "bottomLeft", "bottomRight"],
    5: ["topLeft", "topRight", "center", "bottomLeft", "bottomRight"],
    6: ["topLeft", "topRight", "middleLeft", "middleRight", "bottomLeft", "bottomRight"],
};

export default function Dice({ value = null, isRolling = false }: DiceProps) {
    const safeValue = value && value >= 1 && value <= 6 ? value : 1;
    const dots = DOTS_BY_VALUE[safeValue];

    return (
        <div className={styles.scene} aria-hidden="true">
            <div className={`${styles.dice} ${isRolling ? styles.rolling : ""}`}>
                {dots.map((position) => (
                    <span key={position} className={styles[position]} />
                ))}
            </div>
        </div>
    );
}