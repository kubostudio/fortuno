import ToolLayout from "@/app/components/layout/ToolLayout/ToolLayout";
import DrawsTool from "../sorteos/components/DrawsTool/DrawsTool";

export default function SorteoDeNombresPage() {
    return (
        <ToolLayout
            title="Sorteo de nombres"
            description="Pega una lista de participantes y elige uno o varios ganadores al azar. Ideal para sorteos rápidos, clases, eventos y dinámicas grupales."
            howItWorks={[
                "Escribe o pega un nombre por línea.",
                "Indica cuántos ganadores quieres elegir.",
                "Fortuno seleccionará ganadores sin repetir nombres.",
            ]}
            faq={[
                {
                    question: "¿Los ganadores se pueden repetir?",
                    answer:
                        "Puedes activar la opción para eliminar ganadores anteriores de próximos sorteos.",
                },
                {
                    question: "¿Puedo elegir más de un ganador?",
                    answer:
                        "Sí. Puedes elegir varios ganadores si la cantidad no supera los participantes disponibles.",
                },
            ]}
            relatedTools={[
                { title: "Sorteo de premios", href: "/herramientas/sorteo-de-premios" },
                { title: "Ruleta de nombres", href: "/herramientas/ruleta" },
            ]}
        >
            <DrawsTool defaultMode="names" />
        </ToolLayout>
    );
}