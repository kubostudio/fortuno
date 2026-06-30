import ToolLayout from "@/app/components/layout/ToolLayout/ToolLayout";
import DrawsTool from "../sorteos/components/DrawsTool/DrawsTool";

export default function SorteoDePremiosPage() {
    return (
        <ToolLayout
            title="Sorteo de premios"
            description="Asigna premios aleatoriamente entre una lista de participantes. Ideal para dinámicas, campañas pequeñas, clases y eventos."
            howItWorks={[
                "Agrega los participantes del sorteo.",
                "Escribe un premio por línea.",
                "Fortuno asignará cada premio a un ganador diferente.",
            ]}
            faq={[
                {
                    question: "¿Un participante puede ganar más de un premio?",
                    answer:
                        "No en una misma ronda. Cada premio se asigna a un participante diferente.",
                },
                {
                    question: "¿Puedo evitar repetir ganadores en sorteos posteriores?",
                    answer:
                        "Sí. Activa la opción para eliminar ganadores anteriores.",
                },
            ]}
            relatedTools={[
                { title: "Sorteo de nombres", href: "/herramientas/sorteo-de-nombres" },
                { title: "Ruleta de nombres", href: "/herramientas/ruleta" },
            ]}
        >
            <DrawsTool defaultMode="prizes" />
        </ToolLayout>
    );
}