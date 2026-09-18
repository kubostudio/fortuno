"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

export default function Header() {
    const pathname = usePathname();
    const [isCompact, setIsCompact] = useState(false);
    const lastScrollY = useRef(0);

    useEffect(() => {
        lastScrollY.current = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // When close to the top, restore full navbar
            if (currentScrollY <= 20) {
                setIsCompact(false);
            } else if (currentScrollY > lastScrollY.current + 8) {
                // Scrolling down -> compact navbar & hide logo
                setIsCompact(true);
            } else if (currentScrollY < lastScrollY.current - 8) {
                // Scrolling up -> restore navbar & show logo
                setIsCompact(false);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isLivePage = Boolean(pathname && /\/sorteos\/[^/]+\/live(\/)?$/.test(pathname));
    if (pathname?.startsWith("/sorteos/admin") || isLivePage) {
        return null;
    }

    const isSorteosActive = pathname === "/sorteos" || pathname?.startsWith("/sorteos/");
    const isHerramientasActive = pathname === "/herramientas" || pathname?.startsWith("/herramientas/");
    const isComoFuncionaActive = pathname === "/como-funciona" || pathname?.startsWith("/como-funciona/");
    const isProximamenteActive = pathname === "/proximamente" || pathname?.startsWith("/proximamente/");

    return (
        <header className={`${styles.header} ${isCompact ? styles.headerCompact : ""}`}>
            <div className={`${styles.inner} ${isCompact ? styles.compact : ""}`}>
                <nav className={styles.nav}>
                    <Link
                        href="/sorteos"
                        className={`${styles.navLink} ${styles.sorteosLink} ${isSorteosActive ? styles.active : ""}`}
                    >
                        Sorteos
                    </Link>

                    <Link
                        href="/herramientas"
                        className={`${styles.navLink} ${isHerramientasActive ? styles.active : ""}`}
                    >
                        Herramientas
                    </Link>

                    <div className={`${styles.logoContainer} ${isCompact ? styles.logoHidden : ""}`}>
                        <Link href="/" className={styles.logo} aria-label="Inicio">
                            <img src="/icon.png" alt="Fortuno" width={44} height={44} className={styles.logoImg} />
                        </Link>
                    </div>

                    <Link
                        href="/como-funciona"
                        className={`${styles.navLink} ${isComoFuncionaActive ? styles.active : ""}`}
                    >
                        Cómo funciona
                    </Link>

                    <Link
                        href="/proximamente"
                        className={`${styles.navLink} ${isProximamenteActive ? styles.active : ""}`}
                    >
                        Próximamente
                    </Link>
                </nav>
            </div>
        </header>
    );
}