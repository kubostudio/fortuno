import styles from "./AdSlot.module.css";

type AdSlotProps = {
    variant?: "horizontal" | "sidebar" | "mobile";
    label?: string;
};

export default function AdSlot({
    variant = "horizontal",
    label = "Espacio para anuncio",
}: AdSlotProps) {
    return (
        <aside className={`${styles.adSlot} ${styles[variant]}`}>
            <span>{label}</span>
        </aside>
    );
}