import Link from "next/link";
import styles from "./GeneratorTabs.module.css";

export type GeneratorTab = "number" | "letter" | "color";

const TABS: { id: GeneratorTab; label: string; href: string }[] = [
    {
        id: "number",
        label: "Número",
        href: "/herramientas/numero-aleatorio",
    },
    {
        id: "letter",
        label: "Letra",
        href: "/herramientas/letra-aleatoria",
    },
    {
        id: "color",
        label: "Color",
        href: "/herramientas/color-aleatorio",
    },
];

type GeneratorTabsProps = {
    activeTab?: GeneratorTab;
};

export default function GeneratorTabs({ activeTab }: GeneratorTabsProps) {
    return (
        <nav aria-label="Navegación de generadores" className={styles.modeGrid}>
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
