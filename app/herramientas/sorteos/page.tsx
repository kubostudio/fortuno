import type { Metadata } from "next";
import ToolLayout from "@/app/components/layout/ToolLayout/ToolLayout";
import DrawsTool from "./components/DrawsTool/DrawsTool";

export const metadata: Metadata = {
    title: "Sorteos aleatorios gratis | Fortuno",
    description:
        "Haz sorteos de nombres o premios gratis, con opción para evitar repetir ganadores anteriores.",
};

export default function SorteosPage() {
    return (
        <ToolLayout
            title="Sorteos aleatorios"
            description="Realiza sorteos de nombres, equipos o premios en segundos. Ideal para clases, eventos, campañas pequeñas, dinámicas grupales y decisiones rápidas."
            howItWorks={[
                "Elige el tipo de sorteo que quieres realizar.",
                "Agrega participantes y configura las opciones disponibles.",
                "Fortuno elegirá los resultados aleatoriamente y podrás copiarlos.",
            ]}
            faq={[
                {
                    question: "¿Qué tipos de sorteos puedo hacer?",
                    answer:
                        "Puedes hacer sorteos de nombres, sorteos por equipos y sorteos de premios.",
                },
                {
                    question: "¿Puedo evitar que una persona gane dos veces?",
                    answer:
                        "Sí. Puedes activar la opción para eliminar ganadores anteriores de próximos sorteos.",
                },
                {
                    question: "¿Necesito registrarme?",
                    answer:
                        "No. Puedes usar los sorteos gratuitos de Fortuno sin crear una cuenta.",
                },
            ]}
            relatedTools={[
                {
                    title: "Sorteo de nombres",
                    href: "/herramientas/sorteo-de-nombres",
                },
                {
                    title: "Sorteo de premios",
                    href: "/herramientas/sorteo-de-premios",
                },
                {
                    title: "Ruleta de nombres",
                    href: "/herramientas/ruleta",
                },
            ]}
        >
            <DrawsTool />
        </ToolLayout>
    );
}