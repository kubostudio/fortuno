import ToolLayout from "@/app/components/layout/ToolLayout/ToolLayout";
import GroupsTool from "../grupos/components/GroupsTool/GroupsTool";

export default function FormarEquiposPage() {
    return (
        <ToolLayout
            title="Formar equipos aleatorios"
            description="Forma equipos aleatorios indicando la cantidad de integrantes por equipo o la cantidad total de equipos. Ideal para clases, juegos y trabajos grupales."
            howItWorks={[
                "Agrega los participantes.",
                "Elige si quieres formar equipos por integrantes o por cantidad de equipos.",
                "Fortuno organizará los grupos de forma aleatoria.",
            ]}
            faq={[
                {
                    question: "¿Puedo elegir cuántos equipos formar?",
                    answer:
                        "Sí. Puedes formar equipos por cantidad total de equipos o por integrantes por equipo.",
                },
                {
                    question: "¿Qué pasa si no todos los grupos quedan iguales?",
                    answer:
                        "Fortuno reparte los participantes de la forma más equilibrada posible.",
                },
            ]}
            relatedTools={[
                { title: "Asignar roles", href: "/herramientas/asignar-roles" },
                { title: "Amigo secreto", href: "/herramientas/amigo-secreto" },
            ]}
        >
            <GroupsTool defaultMode="teams" />
        </ToolLayout>
    );
}