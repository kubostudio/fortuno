import type { Metadata } from "next";
import ToolLayout from "@/app/components/layout/ToolLayout/ToolLayout";
import GeneratorsTool from "./components/GeneratorsTool/GeneratorsTool";

export const metadata: Metadata = {
    title: "Generadores aleatorios gratis | Fortuno",
    description:
        "Genera números, letras y colores aleatorios gratis y sin registro con Fortuno.",
};

export default function GeneradoresPage() {
    return (
        <ToolLayout
            title="Generadores aleatorios"
            description="Genera números, letras y colores aleatorios en segundos. Una herramienta simple para sorteos, clases, pruebas, juegos y decisiones rápidas."
            howItWorks={[
                "Elige qué quieres generar: número, letra o color.",
                "Configura las opciones disponibles según el tipo de generador.",
                "Fortuno generará un resultado aleatorio que podrás copiar.",
            ]}
            faq={[
                {
                    question: "¿Qué puedo generar con esta herramienta?",
                    answer:
                        "Puedes generar números aleatorios, letras aleatorias y colores aleatorios en formato hexadecimal.",
                },
                {
                    question: "¿Necesito registrarme?",
                    answer:
                        "No. Puedes usar los generadores gratuitos de Fortuno sin crear una cuenta.",
                },
                {
                    question: "¿El color generado se puede copiar?",
                    answer:
                        "Sí. El resultado se muestra en formato hexadecimal y puedes copiarlo con un clic.",
                },
            ]}
            relatedTools={[
                {
                    title: "Ruleta de nombres",
                    href: "/herramientas/ruleta",
                },
                {
                    title: "Sorteos",
                    href: "/herramientas/sorteos",
                },
            ]}
        >
            <GeneratorsTool />
        </ToolLayout>
    );
}