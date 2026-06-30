import type { Metadata } from "next";
import ContentPage from "@/app/components/layout/ContentPage/ContentPage";

export const metadata: Metadata = {
    title: "Contacto",
    description: "Ponte en contacto con el equipo de Fortuno.",
};

export default function ContactoPage() {
    return (
        <ContentPage
            eyebrow="Contacto"
            title="¿Necesitas ayuda?"
            description="Si tienes dudas, sugerencias o encontraste algún problema, estaremos encantados de escucharte."
        >
            <article>
                <h2>Correo electrónico</h2>

                <p>
                    Puedes escribirnos a:
                </p>

                <p>
                    <strong>contacto@fortuno.pe</strong>
                </p>
            </article>

            <article>
                <h2>Sugerencias</h2>

                <p>
                    Siempre estamos buscando nuevas herramientas y mejoras para Fortuno.
                    Si tienes una idea, cuéntanosla.
                </p>
            </article>

            <article>
                <h2>Errores</h2>

                <p>
                    Si encuentras un error en alguna herramienta, indícanos qué ocurrió y
                    qué estabas haciendo para que podamos solucionarlo rápidamente.
                </p>
            </article>
        </ContentPage>
    );
}