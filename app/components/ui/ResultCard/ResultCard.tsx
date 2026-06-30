import ResultCelebration from "@/app/components/feedback/ResultCelebration/ResultCelebration";
import styles from "./ResultCard.module.css";

type ResultCardProps = {
    label: string;
    children: React.ReactNode;
    celebration?: "none" | "confetti" | "winner";
    size?: "large" | "compact";
};

export default function ResultCard({
    label,
    children,
    celebration = "none",
    size = "large",
}: ResultCardProps) {
    return (
        <div className={styles.resultBox}>
            {celebration !== "none" && (
                <ResultCelebration active type={celebration} />
            )}

            <span>{label}</span>

            <div className={`${styles.content} ${styles[size]}`}>{children}</div>
        </div>
    );
}