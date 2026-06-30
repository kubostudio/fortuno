import Link from "next/link";
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
      { title: "Formar parejas", href: "/herramientas/formar-parejas" },
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
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>Gratis, rápido y sin registro</span>

          <h1>Herramientas confiables para sorteos online</h1>

          <p>
            Genera números aleatorios, crea ruletas, organiza sorteos pequeños
            y prepara dinámicas para clases, grupos, campañas y eventos.
          </p>

          <div className={styles.heroActions}>
            <Link href="/herramientas" className={styles.primaryButton}>
              Ver herramientas gratis
            </Link>
            <Link href="#futuro" className={styles.secondaryButton}>
              Ver plataforma futura
            </Link>
          </div>
        </div>

        <aside className={styles.heroCard}>
          <p className={styles.cardLabel}>Ejemplo rápido</p>
          <strong>Ganador elegido</strong>
          <span>Participante #18</span>
        </aside>
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
            Fortuno prioriza que puedas realizar un sorteo en pocos segundos,
            sin formularios innecesarios ni anuncios invasivos.
          </p>
        </div>

        <div className={styles.benefitGrid}>
          <article>
            <h3>Sin registro</h3>
            <p>Las herramientas gratuitas estarán disponibles al instante.</p>
          </article>

          <article>
            <h3>Diseño claro</h3>
            <p>Botones visibles, resultados destacados y uso intuitivo.</p>
          </article>

          <article>
            <h3>Preparado para crecer</h3>
            <p>
              Más adelante Fortuno permitirá crear sorteos profesionales,
              campañas y rifas.
            </p>
          </article>
        </div>
      </section>

      <section id="futuro" className={styles.futureSection}>
        <div>
          <span>Próximamente</span>
          <h2>Sorteos profesionales con Fortuno</h2>
          <p>
            En el futuro podrás crear sorteos públicos, vender participaciones,
            gestionar campañas y realizar rifas con una experiencia más
            transparente y profesional.
          </p>
        </div>

        <Link href="/" className={styles.primaryButton}>
          Mantenerme informado
        </Link>
      </section>
    </main>
  );
}