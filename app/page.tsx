"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import styles from "./page.module.css";

const categories = [
  {
    title: "Generadores",
    description: "Resultados aleatorios rápidos para clases, pruebas y juegos.",
    href: "/herramientas/generadores",
    tools: [
      { title: "Número aleatorio", href: "/herramientas/numero-aleatorio" },
      { title: "Letra aleatoria", href: "/herramientas/letra-aleatoria" },
      { title: "Color aleatorio", href: "/herramientas/color-aleatorio" },
    ],
  },
  {
    title: "Sorteos",
    description: "Elige ganadores, asigna premios o usa una ruleta visual.",
    href: "/herramientas/sorteos",
    tools: [
      { title: "Sorteo de nombres", href: "/herramientas/sorteo-de-nombres" },
      { title: "Sorteo de premios", href: "/herramientas/sorteo-de-premios" },
      { title: "Ruleta de nombres", href: "/herramientas/ruleta" },
    ],
  },
  {
    title: "Grupos",
    description: "Forma equipos, parejas, roles o amigo secreto.",
    href: "/herramientas/grupos",
    tools: [
      { title: "Formar equipos", href: "/herramientas/formar-equipos" },
      { title: "Asignar roles", href: "/herramientas/asignar-roles" },
      { title: "Amigo secreto", href: "/herramientas/amigo-secreto" },
    ],
  },
  {
    title: "Azar y juegos",
    description: "Herramientas simples para jugar o decidir al instante.",
    href: "/herramientas/azar-rapido",
    tools: [
      { title: "Lanzar moneda", href: "/herramientas/lanzar-moneda" },
      { title: "Lanzar dado", href: "/herramientas/lanzar-dado" },
      { title: "Juegos aleatorios", href: "/herramientas/juegos" },
    ],
  },
];

export default function HomePage() {
  const lastButtonHoverTime = useRef(0);
  const cardRef = useRef<HTMLElement | null>(null);

  const fireCardConfetti = (particleCount = 65) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount,
      spread: 80,
      startVelocity: 30,
      origin: { x, y },
      colors: ["#4e1db9", "#FBB809", "#16a34a", "#ec4899", "#3b82f6", "#f97316"],
      disableForReducedMotion: true,
      scalar: 0.8,
    });
  };

  useEffect(() => {
    // Se ejecuta al cargar la página
    const timeout = setTimeout(() => {
      fireCardConfetti(70);
    }, 400);

    // Se ejecuta periódicamente para mantener el dinamismo
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        fireCardConfetti(35);
      }
    }, 5500);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  function handleButtonHover(e: React.MouseEvent<HTMLElement>) {
    const now = Date.now();
    if (now - lastButtonHoverTime.current < 500) return;
    lastButtonHoverTime.current = now;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 55, // Más tupido
      spread: 65,
      startVelocity: 24,
      origin: { x, y },
      colors: ["#4e1db9", "#FBB809", "#16a34a", "#ec4899", "#3b82f6", "#f97316", "#a855f7"],
      disableForReducedMotion: true,
      scalar: 0.55, // Más pequeño
      ticks: 120,
    });
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>Sorteos en vivo y herramientas gratis</span>

          <h1>Sorteos online y herramientas de azar confiables</h1>

          <p>
            Participa en sorteos oficiales con tickets y resultados en vivo,
            genera números aleatorios, crea ruletas interactivas y organiza
            dinámicas para comunidades, eventos y marcas.
          </p>

          <div className={styles.heroActions}>
            <Link
              href="/sorteos"
              className={styles.primaryButton}
              onMouseEnter={handleButtonHover}
            >
              Ver sorteos activos
            </Link>
            <Link href="/herramientas" className={styles.secondaryButton}>
              Ver herramientas gratis
            </Link>
          </div>
        </div>

        <div className={styles.heroCardWrapper}>
          <aside
            ref={cardRef}
            className={styles.heroCard}
            onClick={() => fireCardConfetti(50)}
          >
            <p className={styles.cardLabel}>Sorteo en vivo</p>
            <strong>Ganador elegido</strong>
            <span>Ticket FORT001482 🎉</span>
          </aside>
        </div>
      </section>

      <section id="herramientas" className={styles.section}>
        <div className={styles.sectionHeader}>
          <span>Herramientas gratuitas</span>
          <h2>Todo lo que puedes hacer con Fortuno</h2>
          <p>
            Explora herramientas organizadas por categoría para sorteos, grupos,
            generadores, juegos y decisiones rápidas.
          </p>
        </div>

        <div className={styles.categoryGrid}>
          {categories.map((category) => (
            <article key={category.title} className={styles.categoryCard}>
              <div>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </div>

              <div className={styles.categoryLinks}>
                {category.tools.map((tool) => (
                  <Link key={tool.href} href={tool.href}>
                    {tool.title}
                  </Link>
                ))}
              </div>

              <Link href={category.href} className={styles.categoryButton}>
                Ver categoría →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section id="como-funciona" className={styles.section}>
        <div className={styles.sectionHeader}>
          <span>Experiencia simple</span>
          <h2>Diseñado para no complicarte</h2>
          <p>
            Fortuno combina la emoción de sorteos en directo con herramientas de azar
            inmediatas, sin formularios innecesarios ni publicidad invasiva.
          </p>
        </div>

        <div className={styles.benefitGrid}>
          <article>
            <h3>Herramientas sin registro</h3>
            <p>Generadores, ruletas y utilidades 100% gratuitas listas para usar al instante.</p>
          </article>

          <article>
            <h3>Sorteos transparentes</h3>
            <p>Participa en sorteos verificados, adquiere tus tickets y sigue las transmisiones en vivo.</p>
          </article>

          <article>
            <h3>Resultados al instante</h3>
            <p>
              Diseño intuitivo con algoritmos aleatorios seguros y ganadores destacados en tiempo real.
            </p>
          </article>
        </div>
      </section>

      <section id="sorteos" className={styles.futureSection}>
        <div>
          <span>Nuevo</span>
          <h2>Participa en nuestros sorteos</h2>
          <p>
            Elige el sorteo que más te guste, adquiere tus tickets en segundos y sigue los resultados en vivo con total transparencia y seguridad.
          </p>
        </div>

        <Link href="/sorteos" className={styles.primaryButton}>
          Ver sorteos
        </Link>
      </section>
    </main>
  );
}