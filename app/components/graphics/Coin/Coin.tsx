import styles from "./Coin.module.css";

type CoinResult = "Cara" | "Sello" | "";

type CoinProps = {
    result?: CoinResult;
    isFlipping?: boolean;
};

export default function Coin({ result = "", isFlipping = false }: CoinProps) {
    return (
        <div className={styles.scene} aria-hidden="true">
            <div
                className={[
                    styles.coin,
                    isFlipping ? styles.flipping : "",
                    !isFlipping && result === "Cara" ? styles.resultCara : "",
                    !isFlipping && result === "Sello" ? styles.resultSello : "",
                ].join(" ")}
            >
                <div className={`${styles.face} ${styles.front}`}>
                    <span className={styles.mark}>F</span>
                    <strong>Fortuno</strong>
                    <small>Cara</small>
                </div>

                <div className={`${styles.face} ${styles.back}`}>
                    <span className={styles.star}>★</span>
                    <strong>Sello</strong>
                    <small>Fortuno</small>
                </div>
            </div>
        </div>
    );
}