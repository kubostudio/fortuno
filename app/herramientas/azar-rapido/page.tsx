import type { Metadata } from "next";
import ToolLayout from "@/app/components/layout/ToolLayout/ToolLayout";
import QuickRandomTool from "./components/QuickRandomTool/QuickRandomTool";

export const metadata: Metadata = {
    title: "Azar rápido: moneda y dado virtual | Fortuno",
    description:
        "Lanza una moneda o un dado virtual gratis para juegos, decisiones rápidas y dinámicas.",
};

export default function AzarRapidoPage() {
    return (
        <ToolLayout
            title="Azar rápido"
            description="Lanza una moneda o un dado virtual en segundos. Ideal para tomar decisiones rápidas, juegos, dinámicas y actividades."
            howItWorks={[
                "Selecciona si quieres lanzar una moneda o un dado.",
                "Presiona el botón correspondiente.",
                "Fortuno generará un resultado completamente aleatorio.",
            ]}
            faq={[
                {
                    question: "¿La moneda y el dado son aleatorios?",
                    answer:
                        "Sí. Ambos utilizan generación aleatoria del navegador para obtener resultados impredecibles.",
                },
                {
                    question: "¿Puedo usarlo gratis?",
                    answer:
                        "Sí. Todas las herramientas de azar rápido son gratuitas y no requieren registro.",
                },
                {
                    question: "¿Puedo compartir el resultado?",
                    answer:
                        "Sí. Tanto la moneda como el dado permiten copiar el resultado con un clic.",
                },
            ]}
            relatedTools={[
                {
                    title: "Generadores aleatorios",
                    href: "/herramientas/generadores",
                },
                {
                    title: "Juegos aleatorios",
                    href: "/herramientas/juegos",
                },
            ]}
        >
            <QuickRandomTool />
        </ToolLayout>
    );
}