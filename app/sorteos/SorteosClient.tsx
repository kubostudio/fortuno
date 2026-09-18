"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, CheckCircle2, FileText } from "lucide-react";
import { Giveaway } from "@/app/lib/types/giveaway";
import GiveawayCard from "@/app/components/sorteos/GiveawayCard/GiveawayCard";
import HowToParticipateModal from "@/app/components/sorteos/HowToParticipateModal/HowToParticipateModal";
import styles from "./page.module.css";

interface SorteosClientProps {
    initialGiveaways: Giveaway[];
}

export default function SorteosClient({ initialGiveaways }: SorteosClientProps) {
    const router = useRouter();
    const [giveaways] = useState<Giveaway[]>(initialGiveaways);
    const [selectedTab, setSelectedTab] = useState<"active" | "all" | "completed">("active");
    const [isHowToModalOpen, setIsHowToModalOpen] = useState(false);

    const filteredGiveaways = giveaways.filter((g) => {
        if (selectedTab === "active") return g.status === "active";
        if (selectedTab === "completed") return g.status === "completed";
        return true;
    });

    const activeCount = giveaways.filter((g) => g.status === "active").length;
    const completedCount = giveaways.filter((g) => g.status === "completed").length;

    return (
        <main className={styles.container}>

            {/* Corporate Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroMain}>
                    <div className={styles.heroBadge}>
                        <ShieldCheck size={16} className={styles.badgeIcon} />
                        <span>Sorteos Verificados</span>
                    </div>

                    <h1 className={styles.heroTitle}>
                        List@ para comenzar a ganar?
                    </h1>

                    <p className={styles.heroSubtitle}>
                        Participa en dinámicas oficiales con asignación de tickets garantizada,
                        selección aleatoria auditable y transmisión en vivo de cada resultado.
                        Cada ticket incluye <strong>3 oportunidades de ganar</strong> o participa refiriendo a 3 amigos.
                    </p>

                    <div className={styles.heroActions}>
                        <button
                            type="button"
                            className={styles.heroBtnSecondary}
                            onClick={() => setIsHowToModalOpen(true)}
                        >
                            <FileText size={17} /> Bases y funcionamiento
                        </button>
                    </div>
                </div>

                {/* Trust & Verification Panel */}
                <div className={styles.heroTrustPanel}>
                    <div className={styles.trustHeader}>
                        <p>Estándares de seguridad aplicados a cada sorteo:</p>
                    </div>

                    <ul className={styles.trustList}>
                        <li>
                            <CheckCircle2 size={18} className={styles.trustCheck} />
                            <div>
                                <strong>Selección Aleatoria Inalterable</strong>
                                <span>Algoritmo certificado ejecutado en tiempo real.</span>
                            </div>
                        </li>
                        <li>
                            <CheckCircle2 size={18} className={styles.trustCheck} />
                            <div>
                                <strong>Registro Público de Ganadores</strong>
                                <span>Historial inmutable con tickets y fechas de emisión.</span>
                            </div>
                        </li>
                        <li>
                            <CheckCircle2 size={18} className={styles.trustCheck} />
                            <div>
                                <strong>Transmisión y Entrega Verificada</strong>
                                <span>Seguimiento en directo y entrega formal de cada premio.</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>

            {/* Sorteos Section */}
            <section id="sorteos-disponibles" className={styles.giveawaysSection}>

                <div className={styles.sectionHeader}>
                    <div>
                        <h2 className={styles.sectionTitle}>Sorteos Disponibles</h2>
                        <p className={styles.sectionSubtitle}>
                            Explora los sorteos vigentes, precios de tickets y cupos disponibles.
                        </p>
                    </div>

                    {/* Filter Tabs */}
                    <div className={styles.tabsWrapper} role="tablist">
                        <button
                            type="button"
                            className={`${styles.tabBtn} ${selectedTab === "active" ? styles.activeTab : ""}`}
                            onClick={() => setSelectedTab("active")}
                            role="tab"
                            aria-selected={selectedTab === "active"}
                        >
                            Activos ({activeCount})
                        </button>
                        <button
                            type="button"
                            className={`${styles.tabBtn} ${selectedTab === "all" ? styles.activeTab : ""}`}
                            onClick={() => setSelectedTab("all")}
                            role="tab"
                            aria-selected={selectedTab === "all"}
                        >
                            Todos ({giveaways.length})
                        </button>
                        <button
                            type="button"
                            className={`${styles.tabBtn} ${selectedTab === "completed" ? styles.activeTab : ""}`}
                            onClick={() => setSelectedTab("completed")}
                            role="tab"
                            aria-selected={selectedTab === "completed"}
                        >
                            Finalizados ({completedCount})
                        </button>
                    </div>
                </div>

                {/* Grid of Cards */}
                <div className={styles.grid}>
                    {filteredGiveaways.map((giveaway) => (
                        <GiveawayCard
                            key={giveaway.id}
                            giveaway={giveaway}
                        />
                    ))}
                </div>
            </section>

            <HowToParticipateModal
                isOpen={isHowToModalOpen}
                onClose={() => setIsHowToModalOpen(false)}
                onStartRegistration={() => {
                    setIsHowToModalOpen(false);
                    const firstActive = giveaways.find((g) => g.status === "active");
                    if (firstActive) {
                        router.push(`/sorteos/${firstActive.slug}`);
                    }
                }}
            />
        </main>
    );
}
