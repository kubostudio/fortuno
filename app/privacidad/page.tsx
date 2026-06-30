import type { Metadata } from "next";
import ContentPage from "@/app/components/layout/ContentPage/ContentPage";

export const metadata: Metadata = {
    title: "Política de privacidad",
    description:
        "Conoce cómo Fortuno trata la información en sus herramientas gratuitas.",
};

export default function PrivacidadPage() {
    return (
        <ContentPage
            eyebrow="Legal"
            title="Política de privacidad"
            description="Conoce cómo tratamos la información en Fortuno."
        >
            <article>
                <h2>Información que no almacenamos</h2>
                <p>
                    No almacenamos listas de participantes, resultados generados,
                    asignaciones de amigo secreto ni datos ingresados en las herramientas
                    gratuitas.
                </p>
            </article>

            <article>
                <h2>Analítica y publicidad</h2>
                <p>
                    Más adelante podremos usar servicios de analítica y publicidad para
                    mejorar Fortuno y monetizar el sitio.
                </p>
            </article>

            <article>
                <h2>Contacto</h2>
                <p>
                    Si tienes dudas sobre privacidad, puedes comunicarte con nosotros
                    desde la página de contacto.
                </p>
            </article>
        </ContentPage>
    );
}