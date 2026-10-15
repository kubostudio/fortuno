import GameTabs from "../GameTabs/GameTabs";
import RockPaperScissors from "../RockPaperScissors/RockPaperScissors";

import styles from "./GamesTool.module.css";

export default function GamesTool() {
    return (
        <div className={styles.tool}>
            <GameTabs activeTab="rps" />
            <RockPaperScissors />
        </div>
    );
}