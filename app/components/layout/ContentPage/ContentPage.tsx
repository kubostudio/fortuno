import styles from "./ContentPage.module.css";

type ContentPageProps = {
    eyebrow?: string;
    title: string;
    description?: string;
    children: React.ReactNode;
};

export default function ContentPage({
    eyebrow,
    title,
    description,
    children,
}: ContentPageProps) {
    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                {eyebrow && <span>{eyebrow}</span>}
                <h1>{title}</h1>
                {description && <p>{description}</p>}
            </section>

            <section className={styles.content}>{children}</section>
        </main>
    );
}