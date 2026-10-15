"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Header.module.css";

const toolGroups = [
    {
        title: "Generadores",
        links: [
            { label: "Número aleatorio", href: "/herramientas/numero-aleatorio" },
            { label: "Letra aleatoria", href: "/herramientas/letra-aleatoria" },
            { label: "Color aleatorio", href: "/herramientas/color-aleatorio" },
        ],
    },
    {
        title: "Sorteos",
        links: [
            { label: "Sorteo de nombres", href: "/herramientas/sorteo-de-nombres" },
            { label: "Sorteo de premios", href: "/herramientas/sorteo-de-premios" },
            { label: "Ruleta", href: "/herramientas/ruleta" },
        ],
    },
    {
        title: "Grupos",
        links: [
            { label: "Formar equipos", href: "/herramientas/formar-equipos" },
            { label: "Asignar roles", href: "/herramientas/asignar-roles" },
            { label: "Amigo secreto", href: "/herramientas/amigo-secreto" },
        ],
    },
    {
        title: "Azar y juegos",
        links: [
            { label: "Piedra, papel o tijera", href: "/herramientas/piedra-papel-o-tijera" },
            { label: "Verdad o reto", href: "/herramientas/verdad-o-reto" },
            { label: "Bingo", href: "/herramientas/bingo" },
            { label: "Lanzar moneda", href: "/herramientas/lanzar-moneda" },
            { label: "Lanzar dado", href: "/herramientas/lanzar-dado" },
            { label: "Juegos", href: "/herramientas/juegos" },
        ],
    },
];

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function closeMenu() {
        setIsMenuOpen(false);
    }

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <Link href="/" className={styles.logo} onClick={closeMenu}>
                    Fortuno
                </Link>

                <nav className={styles.nav}>
                    <Link href="/como-funciona" onClick={closeMenu}>
                        Cómo funciona
                    </Link>

                    <Link href="/proximamente" onClick={closeMenu}>
                        Próximamente
                    </Link>

                    <div className={styles.menuWrapper}>
                        <button
                            type="button"
                            className={styles.menuButton}
                            onClick={() => setIsMenuOpen((current) => !current)}
                            aria-expanded={isMenuOpen}
                        >
                            Ver herramientas
                        </button>

                        {isMenuOpen && (
                            <div className={styles.megaMenu}>
                                {toolGroups.map((group) => (
                                    <section key={group.title}>
                                        <h3>{group.title}</h3>

                                        <div>
                                            {group.links.map((link) => (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    onClick={closeMenu}
                                                >
                                                    {link.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </section>
                                ))}
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}