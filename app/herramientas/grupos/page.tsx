import type { Metadata } from "next";
import ToolLayout from "@/app/components/layout/ToolLayout/ToolLayout";
import GroupsTool from "./components/GroupsTool/GroupsTool";

export const metadata: Metadata = {
    title: "Grupos aleatorios gratis | Fortuno",
    description:
        "Forma equipos, parejas o asigna roles aleatoriamente gratis con Fortuno.",
};

export default function GruposPage() {
    return (
        <ToolLayout
            title="Grupos aleatorios"
            description="Forma equipos, parejas o asigna roles aleatoriamente. Ideal para clases, trabajos grupales, dinámicas, talleres y actividades en equipo."
            howItWorks={[
                "Elige si quieres formar equipos, parejas o asignar roles.",
                "Agrega los participantes y configura las opciones necesarias.",
                "Fortuno organizará los resultados de forma aleatoria.",
            ]}
            faq={[
                {
                    question: "¿Puedo formar equipos de varios integrantes?",
                    answer:
                        "Sí. Puedes indicar cuántos integrantes debe tener cada equipo.",
                },
                {
                    question: "¿Qué pasa si queda una persona sin pareja?",
                    answer:
                        "Si la cantidad de participantes es impar, la última pareja puede quedar con una sola persona.",
                },
                {
                    question: "¿Puedo asignar roles repetidos?",
                    answer:
                        "Sí. Si hay más participantes que roles, Fortuno reutilizará roles de forma aleatoria.",
                },
            ]}
            relatedTools={[
                {
                    title: "Sorteos aleatorios",
                    href: "/herramientas/sorteos",
                },
                {
                    title: "Ruleta de nombres",
                    href: "/herramientas/ruleta",
                },
            ]}
        >
            <GroupsTool />
        </ToolLayout>
    );
}