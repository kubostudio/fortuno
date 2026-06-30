import styles from "./Wheel.module.css";

type WheelProps = {
    participants: string[];
    rotation: number;
    isSpinning: boolean;
};

const COLORS = [
    "#dcfce7",
    "#dbeafe",
    "#fef3c7",
    "#fee2e2",
    "#ede9fe",
    "#cffafe",
    "#fce7f3",
    "#e0f2fe",
];

export default function Wheel({
    participants,
    rotation,
    isSpinning,
}: WheelProps) {
    const segmentAngle = 360 / Math.max(participants.length, 1);

    const wheelBackground =
        participants.length === 0
            ? "conic-gradient(#dbeafe 0deg 360deg)"
            : `conic-gradient(${participants
                .map((_, index) => {
                    const start = index * segmentAngle;
                    const end = (index + 1) * segmentAngle;
                    return `${COLORS[index % COLORS.length]} ${start}deg ${end}deg`;
                })
                .join(", ")})`;

    return (
        <div className={styles.wheelArea}>
            <div className={styles.pointer} />

            <div
                className={`${styles.wheel} ${isSpinning ? styles.spinning : ""}`}
                style={{
                    background: wheelBackground,
                    transform: `rotate(${rotation}deg)`,
                }}
            >
                {participants.map((participant, index) => {
                    const angle = index * segmentAngle + segmentAngle / 2;

                    return (
                        <span
                            key={`${participant}-${index}`}
                            className={styles.segmentLabel}
                            style={{
                                transform: `
                  rotate(${angle}deg)
                  translateY(-92px)
                  rotate(${-angle}deg)
                `,
                            }}
                        >
                            {participant}
                        </span>
                    );
                })}

                <div className={styles.centerBadge}>Fortuno</div>
            </div>
        </div>
    );
}