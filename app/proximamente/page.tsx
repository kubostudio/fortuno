import type { Metadata } from "next";
import ContentPage from "@/app/components/layout/ContentPage/ContentPage";

export const metadata: Metadata = {
    title: "Próximamente",
    description:
        "Fortuno pronto permitirá crear sorteos profesionales, campañas y rifas online.",
};

export default function ProximamentePage() {
    return (
        <ContentPage
            eyebrow="Próximamente"
            title="Sorteos profesionales con Fortuno"
            description="Estamos construyendo una plataforma para crear sorteos públicos, campañas, rifas y experiencias promocionales."
        >
            <article>
                <h2>Lo que viene</h2>
                <p>
                    Fortuno permitirá crear sorteos con páginas públicas, participantes,
                    resultados transparentes y herramientas pensadas para personas,
                    empresas y organizaciones.
                </p>
            </article>

            <article>
                <h2>Mientras tanto</h2>
                <p>
                    Puedes usar gratis nuestras herramientas para sorteos, grupos,
                    generadores, juegos y azar rápido.
                </p>
            </article>
        </ContentPage>
    );
}