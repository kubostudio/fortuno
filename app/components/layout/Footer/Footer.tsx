"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Footer.module.css";

const footerGroups = [
    {
        title: "Sorteos",
        links: [
            { label: "Sorteos activos", href: "/sorteos" },
            { label: "Ganadores", href: "/sorteos/ganadores" },
            { label: "Cómo funciona", href: "/como-funciona" },
        ],
    },
    {
        title: "Herramientas",
        links: [
            { label: "Generadores", href: "/herramientas/generadores" },
            { label: "Sorteos de nombres", href: "/herramientas/sorteo-de-nombres" },
            { label: "Ruleta", href: "/herramientas/ruleta" },
            { label: "Grupos y equipos", href: "/herramientas/grupos" },
            { label: "Azar y juegos", href: "/herramientas/azar-rapido" },
        ],
    },
    {
        title: "Legal & Empresa",
        links: [
            { label: "Privacidad", href: "/privacidad" },
            { label: "Términos y condiciones", href: "/terminos" },
            { label: "Cookies", href: "/cookies" },
            { label: "Contacto", href: "/contacto" },
        ],
    },
];

export default function Footer() {
    const pathname = usePathname();
    const isLivePage = Boolean(pathname && /\/sorteos\/[^/]+\/live(\/)?$/.test(pathname));
    if (pathname?.startsWith("/sorteos/admin") || isLivePage) {
        return null;
    }

    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <div className={styles.brand}>
                    <Link href="/" className={styles.logoLink} aria-label="Fortuno Inicio">
                        <img src="/icon.png" alt="Fortuno" width={52} height={52} className={styles.logoImg} />
                        <span className={styles.brandName}>Fortuno</span>
                    </Link>

                    <p className={styles.brandDesc}>
                        Plataforma para sorteos en directo, herramientas de azar gratuitas,
                        ruletas interactivas y decisiones aleatorias 100% transparentes.
                    </p>
                </div>

                <div className={styles.links}>
                    {footerGroups.map((group) => (
                        <section key={group.title} className={styles.section}>
                            <h3 className={styles.sectionTitle}>{group.title}</h3>

                            <ul className={styles.linkList}>
                                {group.links.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className={styles.link}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            </div>

            <div className={styles.bottom}>
                <div className={styles.bottomInner}>
                    <span>© {new Date().getFullYear()} Fortuno. Todos los derechos reservados.</span>
                    <span>
                        Desarrollado por{" "}
                        <a
                            href="https://kubostudio.co"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.developerLink}
                        >
                            KUBOstudio
                        </a>
                    </span>
                </div>
            </div>
        </footer>
    );
}