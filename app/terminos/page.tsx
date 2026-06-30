import type { Metadata } from "next";
import ContentPage from "@/app/components/layout/ContentPage/ContentPage";

export const metadata: Metadata = {
    title: "Términos y condiciones",
    description: "Consulta los términos de uso de Fortuno.",
};

export default function TerminosPage() {
    return (
        <ContentPage
            eyebrow="Legal"
            title="Términos y condiciones"
            description="Condiciones generales para usar Fortuno."
        >
            <article>
                <h2>Uso de las herramientas</h2>
                <p>
                    Las herramientas gratuitas se proporcionan “tal como están”. El
                    usuario es responsable del uso que haga de los resultados.
                </p>
            </article>

            <article>
                <h2>Propiedad intelectual</h2>
                <p>
                    El contenido, diseño, marca e identidad visual de Fortuno pertenecen a
                    sus respectivos propietarios.
                </p>
            </article>

            <article>
                <h2>Cambios</h2>
                <p>
                    Estos términos podrán modificarse conforme evolucione la plataforma.
                </p>
            </article>
        </ContentPage>
    );
}