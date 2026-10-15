import Link from "next/link";
import styles from "./DrawTabs.module.css";

export type DrawTab = "names" | "prizes" | "wheel";

const TABS: { id: DrawTab; label: string; href: string }[] = [
    {
        id: "names",
        label: "Sorteo de nombres",
        href: "/herramientas/sorteo-de-nombres",
    },
    {
        id: "prizes",
        label: "Sorteo de premios",
        href: "/herramientas/sorteo-de-premios",
    },
    {
        id: "wheel",
        label: "Ruleta",
        href: "/herramientas/ruleta",
    },
];

type DrawTabsProps = {
    activeTab?: DrawTab;
};

export default function DrawTabs({ activeTab }: DrawTabsProps) {
    return (
        <nav aria-label="Navegación de sorteos" className={styles.modeGrid}>
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
