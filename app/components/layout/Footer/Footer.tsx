import Link from "next/link";
import styles from "./Footer.module.css";

const footerGroups = [
    {
        title: "Herramientas",
        links: [
            { label: "Generadores", href: "/herramientas/generadores" },
            { label: "Sorteos", href: "/herramientas/sorteos" },
            { label: "Grupos", href: "/herramientas/grupos" },
            { label: "Juegos", href: "/herramientas/juegos" },
            { label: "Azar rápido", href: "/herramientas/azar-rapido" },
        ],
    },
    {
        title: "Empresa",
        links: [
            { label: "Cómo funciona", href: "/como-funciona" },
            { label: "Próximamente", href: "/proximamente" },
            { label: "Contacto", href: "/contacto" },
        ],
    },
    {
        title: "Legal",
        links: [
            { label: "Privacidad", href: "/privacidad" },
            { label: "Términos", href: "/terminos" },
            { label: "Cookies", href: "/cookies" },
        ],
    },
];

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <div className={styles.brand}>
                    <Link href="/" className={styles.logo}>
                        Fortuno
                    </Link>

                    <p>
                        Herramientas gratuitas para sorteos, grupos, juegos y decisiones
                        aleatorias.
                    </p>
                </div>

                <div className={styles.links}>
                    {footerGroups.map((group) => (
                        <section key={group.title}>
                            <h3>{group.title}</h3>

                            {group.links.map((link) => (
                                <Link key={link.href} href={link.href}>
                                    {link.label}
                                </Link>
                            ))}
                        </section>
                    ))}
                </div>
            </div>

            <div className={styles.bottom}>
                © 2026 Fortuno. Todos los derechos reservados.
            </div>
        </footer>
    );
}