import type { Metadata } from "next";
import ToolLayout from "@/app/components/layout/ToolLayout/ToolLayout";
import SecretFriendGenerator from "./components/SecretFriendGenerator/SecretFriendGenerator";

export const metadata: Metadata = {
    title: "Amigo secreto gratis | Fortuno",
    description:
        "Organiza un amigo secreto online gratis con asignaciones privadas y sin registro.",
};

export default function AmigoSecretoPage() {
    return (
        <ToolLayout
            title="Amigo secreto"
            description="Organiza un amigo secreto de forma privada. Cada participante puede ver únicamente a quién le tocó regalar, sin revelar las asignaciones de los demás."
            howItWorks={[
                "Escribe un nombre por línea en la lista de participantes.",
                "Fortuno genera las asignaciones evitando que alguien se toque a sí mismo.",
                "Cada participante ve su resultado de forma privada, uno por uno.",
            ]}
            faq={[
                {
                    question: "¿Cuántos participantes necesito?",
                    answer:
                        "Necesitas al menos 3 participantes para generar un amigo secreto de forma más segura y útil.",
                },
                {
                    question: "¿Alguien puede tocarse a sí mismo?",
                    answer:
                        "No. Fortuno evita automáticamente que una persona sea asignada a sí misma.",
                },
                {
                    question: "¿Fortuno guarda las asignaciones?",
                    answer:
                        "No. Las asignaciones se generan en tu navegador y no se guardan en nuestros servidores.",
                },
            ]}
            relatedTools={[
                {
                    title: "Ruleta de nombres",
                    href: "/herramientas/ruleta",
                },
                {
                    title: "Sorteo de nombres",
                    href: "/herramientas/sorteo-de-nombres",
                },
            ]}
        >
            <SecretFriendGenerator />
        </ToolLayout>
    );
}