import ToolLayout from "@/app/components/layout/ToolLayout/ToolLayout";
import GroupsTool from "../grupos/components/GroupsTool/GroupsTool";

export default function AsignarRolesPage() {
    return (
        <ToolLayout
            title="Asignar roles aleatoriamente"
            description="Asigna roles al azar entre una lista de participantes. Ideal para trabajos grupales, talleres, dinámicas y actividades organizadas."
            howItWorks={[
                "Agrega los participantes.",
                "Escribe los roles disponibles.",
                "Fortuno asignará los roles de forma aleatoria.",
            ]}
            faq={[
                {
                    question: "¿Qué pasa si hay más participantes que roles?",
                    answer:
                        "Fortuno reutilizará roles de forma aleatoria para cubrir a todos los participantes.",
                },
                {
                    question: "¿Puedo copiar las asignaciones?",
                    answer: "Sí. Puedes copiar los roles asignados con un clic.",
                },
            ]}
            relatedTools={[
                { title: "Formar equipos", href: "/herramientas/formar-equipos" },
                { title: "Amigo secreto", href: "/herramientas/amigo-secreto" },
            ]}
        >
            <GroupsTool defaultMode="roles" />
        </ToolLayout>
    );
}