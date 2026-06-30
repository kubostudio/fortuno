import Link from "next/link";
import AdSlot from "@/app/components/ads/AdSlot/AdSlot";
import styles from "./ToolLayout.module.css";

type RelatedTool = {
    title: string;
    href: string;
};

type ToolLayoutProps = {
    title: string;
    description: string;
    children: React.ReactNode;
    howItWorksTitle?: string;
    howItWorks: string[];
    faq: {
        question: string;
        answer: string;
    }[];
    relatedTools?: RelatedTool[];
};

export default function ToolLayout({
    title,
    description,
    children,
    howItWorksTitle = "Cómo funciona",
    howItWorks,
    faq,
    relatedTools = [],
}: ToolLayoutProps) {
    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <div>
                    <Link href="/" className={styles.breadcrumb}>
                        Inicio
                    </Link>
                    <span className={styles.breadcrumbSeparator}>/</span>
                    <span className={styles.breadcrumbCurrent}>Herramientas</span>

                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>
            </section>

            <section className={styles.contentGrid}>
                <div className={styles.mainColumn}>
                    <div className={styles.toolBox}>{children}</div>

                    <AdSlot variant="horizontal" />

                    <section className={styles.infoSection}>
                        <h2>{howItWorksTitle}</h2>

                        <div className={styles.steps}>
                            {howItWorks.map((step, index) => (
                                <article key={step} className={styles.step}>
                                    <span>{index + 1}</span>
                                    <p>{step}</p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className={styles.infoSection}>
                        <h2>Preguntas frecuentes</h2>

                        <div className={styles.faqList}>
                            {faq.map((item) => (
                                <article key={item.question} className={styles.faqItem}>
                                    <h3>{item.question}</h3>
                                    <p>{item.answer}</p>
                                </article>
                            ))}
                        </div>
                    </section>

                    {relatedTools.length > 0 && (
                        <section className={styles.infoSection}>
                            <h2>Herramientas relacionadas</h2>

                            <div className={styles.relatedGrid}>
                                {relatedTools.map((tool) => (
                                    <Link
                                        key={tool.href}
                                        href={tool.href}
                                        className={styles.relatedCard}
                                    >
                                        {tool.title}
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <aside className={styles.sidebar}>
                    <AdSlot variant="sidebar" />
                </aside>
            </section>
        </main>
    );
}