import Link from "next/link";
import styles from "./GroupTabs.module.css";

export type GroupTab = "teams" | "roles" | "secretFriend";

const TABS: { id: GroupTab; label: string; href: string }[] = [
    {
        id: "teams",
        label: "Formar equipos",
        href: "/herramientas/formar-equipos",
    },
    {
        id: "roles",
        label: "Asignar roles",
        href: "/herramientas/asignar-roles",
    },
    {
        id: "secretFriend",
        label: "Amigo secreto",
        href: "/herramientas/amigo-secreto",
    },
];

type GroupTabsProps = {
    activeTab?: GroupTab;
};

export default function GroupTabs({ activeTab }: GroupTabsProps) {
    return (
        <nav aria-label="Navegación de grupos" className={styles.modeGrid}>
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
