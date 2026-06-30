import styles from "./DrawLoader.module.css";

type DrawLoaderProps = {
    text?: string;
};

export default function DrawLoader({
    text = "Escogiendo ganador...",
}: DrawLoaderProps) {
    return (
        <div className={styles.loader}>
            <div className={styles.dots}>
                <span />
                <span />
                <span />
            </div>
            <p>{text}</p>
        </div>
    );
}