import Link from "next/link";
import styles from "./GameTabs.module.css";

export type GameTab = "rps" | "bingo" | "truthOrDare";

const TABS: { id: GameTab; label: string; href: string }[] = [
    {
        id: "rps",
        label: "Piedra, papel o tijera",
        href: "/herramientas/piedra-papel-o-tijera",
    },
    {
        id: "bingo",
        label: "Bingo",
        href: "/herramientas/bingo",
    },
    {
        id: "truthOrDare",
        label: "Verdad o reto",
        href: "/herramientas/verdad-o-reto",
    },
];

type GameTabsProps = {
    activeTab?: GameTab;
};

export default function GameTabs({ activeTab }: GameTabsProps) {
    return (
        <nav aria-label="Navegación de juegos" className={styles.modeGrid}>
            {TABS.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                    <Link
                        key={tab.id}
                        href={tab.href}
                        className={isActive ? styles.activeMode : styles.modeLink}
                        aria-current={isActive ? "page" : undefined}
                    >
                        {tab.label}
                    </Link>
                );
            })}
        </nav>
    );
}
