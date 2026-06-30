import type { Metadata } from "next";
import ContentPage from "@/app/components/layout/ContentPage/ContentPage";

export const metadata: Metadata = {
    title: "Cómo funciona Fortuno",
    description:
        "Conoce cómo Fortuno genera resultados aleatorios y cómo funcionan nuestras herramientas.",
};

export default function ComoFuncionaPage() {
    return (
        <ContentPage
            eyebrow="Fortuno"
            title="¿Cómo funciona Fortuno?"
            description="Nuestro objetivo es ofrecer herramientas rápidas, simples y transparentes para ayudarte a organizar sorteos, grupos y juegos."
        >
            <article>
                <h2>Resultados aleatorios</h2>

                <p>
                    Las herramientas utilizan la capacidad de generación aleatoria del
                    navegador para producir resultados impredecibles en sorteos, juegos y
                    decisiones rápidas.
                </p>
            </article>

            <article>
                <h2>Privacidad</h2>

                <p>
                    La mayoría de herramientas funcionan directamente en tu navegador.
                    No almacenamos participantes, resultados ni asignaciones generadas.
                </p>
            </article>

            <article>
                <h2>Transparencia</h2>

                <p>
                    Fortuno no interviene manualmente en los resultados. Todo el proceso
                    ocurre automáticamente siguiendo el algoritmo correspondiente.
                </p>
            </article>

            <article>
                <h2>Lo que viene</h2>

                <p>
                    Próximamente podrás crear sorteos profesionales, campañas para
                    empresas y eventos públicos con una experiencia aún más transparente.
                </p>
            </article>
        </ContentPage>
    );
}