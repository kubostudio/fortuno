import type { Metadata } from "next";
import ContentPage from "@/app/components/layout/ContentPage/ContentPage";

export const metadata: Metadata = {
    title: "Política de cookies",
    description: "Información sobre el uso de cookies en Fortuno.",
};

export default function CookiesPage() {
    return (
        <ContentPage
            eyebrow="Legal"
            title="Política de cookies"
            description="Conoce cómo utilizamos las cookies en Fortuno."
        >
            <article>
                <h2>¿Qué son las cookies?</h2>

                <p>
                    Las cookies son pequeños archivos que tu navegador almacena para
                    recordar información relacionada con tu visita y mejorar la
                    experiencia de navegación.
                </p>
            </article>

            <article>
                <h2>¿Cómo las usamos?</h2>

                <p>
                    Actualmente Fortuno utiliza la menor cantidad posible de cookies.
                    Conforme incorporemos nuevas funcionalidades, podremos utilizar
                    cookies para recordar preferencias, analizar el uso del sitio y
                    mejorar la experiencia.
                </p>
            </article>

            <article>
                <h2>Publicidad</h2>

                <p>
                    Cuando integremos servicios como Google AdSense, dichos proveedores
                    podrán utilizar cookies de acuerdo con sus propias políticas para
                    mostrar anuncios relevantes.
                </p>
            </article>

            <article>
                <h2>Administración</h2>

                <p>
                    Puedes eliminar o bloquear las cookies desde la configuración de tu
                    navegador en cualquier momento.
                </p>
            </article>
        </ContentPage>
    );
}