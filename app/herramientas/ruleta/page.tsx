import type { Metadata } from "next";
import ToolLayout from "@/app/components/layout/ToolLayout/ToolLayout";
import WheelGenerator from "./components/WheelGenerator/WheelGenerator";

export const metadata: Metadata = {
    title: "Ruleta de nombres gratis | Fortuno",
    description:
        "Crea una ruleta de nombres visual para elegir ganadores o participantes al azar.",
};

export default function RuletaPage() {
    return (
        <ToolLayout
            title="Ruleta de nombres"
            description="Agrega una lista de participantes y gira una ruleta visual para elegir un ganador. Ideal para clases, juegos, grupos y sorteos pequeños."
            howItWorks={[
                "Escribe un nombre por línea en la lista de participantes.",
                "Presiona el botón para girar la ruleta.",
                "Fortuno elegirá un ganador aleatorio y lo mostrará al finalizar.",
            ]}
            faq={[
                {
                    question: "¿Cuántos nombres puedo agregar?",
                    answer:
                        "Puedes agregar tantos nombres como necesites. Para una mejor experiencia visual, recomendamos usar listas pequeñas o medianas.",
                },
                {
                    question: "¿Se repiten los ganadores?",
                    answer:
                        "En esta versión la ruleta elige un ganador por giro. Más adelante agregaremos opciones para excluir ganadores anteriores.",
                },
                {
                    question: "¿Fortuno guarda mi lista?",
                    answer:
                        "No. Esta herramienta funciona en tu navegador y no guarda la lista de participantes.",
                },
            ]}
            relatedTools={[
                {
                    title: "Sorteo de nombres",
                    href: "/herramientas/sorteo-de-nombres",
                },
                {
                    title: "Número aleatorio",
                    href: "/herramientas/numero-aleatorio",
                },
            ]}
        >
            <WheelGenerator />
        </ToolLayout>
    );
}