import type { Metadata } from "next";
import ToolLayout from "@/app/components/layout/ToolLayout/ToolLayout";
import TruthOrDare from "@/app/herramientas/juegos/components/TruthOrDare/TruthOrDare";

export const metadata: Metadata = {
    title: "Verdad o reto online gratis | Generador Fortuno",
    description:
        "Generador de verdad o reto online para fiestas, reuniones y amigos. Sortea preguntas y desafíos aleatorios o agrega los tuyos propios.",
};

export default function VerdadORetoPage() {
    return (
        <ToolLayout
            title="Verdad o reto"
            description="Sortea preguntas incómodas y retos divertidos para tus reuniones y fiestas. Puedes usar la lista predeterminada o añadir tus propias verdades y retos personalizados."
            howItWorks={[
                "Haz clic en «Sortear verdad o reto».",
                "Fortuno elegirá aleatoriamente entre Verdad o Reto y te asignará una consigna.",
                "Si quieres, puedes agregar tus propias preguntas y desafíos personalizados en los campos de texto.",
            ]}
            faq={[
                {
                    question: "¿Qué tipo de preguntas y retos incluye?",
                    answer:
                        "Incluye preguntas y desafíos variados, aptos para dinámicas con amigos, reuniones grupales y momentos divertidos.",
                },
                {
                    question: "¿Puedo agregar mis propias preguntas o retos?",
                    answer:
                        "Sí. Puedes escribir tus propias verdades y retos en los campos opcionales (uno por línea) para combinarlos con la lista predeterminada.",
                },
                {
                    question: "¿Se guardan mis preguntas personalizadas?",
                    answer:
                        "No. Por privacidad, tus preguntas personalizadas solo existen en tu navegador durante la sesión y no se almacenan en servidores.",
                },
            ]}
            relatedTools={[
                {
                    title: "Ruleta de nombres",
                    href: "/herramientas/ruleta",
                },
                {
                    title: "Piedra, papel o tijera",
                    href: "/herramientas/piedra-papel-o-tijera",
                },
                {
                    title: "Amigo secreto",
                    href: "/herramientas/amigo-secreto",
                },
            ]}
        >
            <TruthOrDare />
        </ToolLayout>
    );
}
