import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
    title: "Herramientas gratuitas para sorteos y azar | Fortuno",
    description:
        "Explora herramientas gratuitas de Fortuno para sorteos, ruletas, generadores aleatorios, grupos, amigo secreto, juegos, moneda y dado.",
};

const categories = [
    {
        title: "Generadores",
        tools: [
            { title: "Generadores aleatorios", href: "/herramientas/generadores" },
            { title: "Número aleatorio", href: "/herramientas/numero-aleatorio" },
            { title: "Letra aleatoria", href: "/herramientas/letra-aleatoria" },
            { title: "Color aleatorio", href: "/herramientas/color-aleatorio" },
        ],
    },
    {
        title: "Sorteos",
        tools: [
            { title: "Sorteos aleatorios", href: "/herramientas/sorteos" },
            { title: "Sorteo de nombres", href: "/herramientas/sorteo-de-nombres" },
            { title: "Sorteo de premios", href: "/herramientas/sorteo-de-premios" },
            { title: "Ruleta de nombres", href: "/herramientas/ruleta" },
        ],
    },
    {
        title: "Grupos",
        tools: [
            { title: "Grupos aleatorios", href: "/herramientas/grupos" },
            { title: "Formar equipos", href: "/herramientas/formar-equipos" },
            { title: "Asignar roles", href: "/herramientas/asignar-roles" },
            { title: "Amigo secreto", href: "/herramientas/amigo-secreto" },
        ],
    },
    {
        title: "Azar y juegos",
        tools: [
            { title: "Lanzar moneda", href: "/herramientas/lanzar-moneda" },
            { title: "Lanzar dado", href: "/herramientas/lanzar-dado" },
            { title: "Juegos aleatorios", href: "/herramientas/juegos" },
        ],
    },
];

export default function HerramientasPage() {
    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <span>Herramientas gratuitas</span>
                <h1>Herramientas para sorteos, grupos y juegos</h1>
                <p>
                    Explora las herramientas gratuitas de Fortuno para generar resultados
                    aleatorios, organizar sorteos, formar grupos y jugar en segundos.
                </p>
            </section>

            <section className={styles.grid}>
                {categories.map((category) => (
                    <article key={category.title} className={styles.category}>
                        <h2>{category.title}</h2>

                        <div className={styles.toolList}>
                            {category.tools.map((tool) => (
                                <Link key={tool.href} href={tool.href}>
                                    {tool.title}
                                    <span>→</span>
                                </Link>
                            ))}
                        </div>
                    </article>
                ))}
            </section>
        </main>
    );
}