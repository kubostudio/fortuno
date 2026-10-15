import type { Metadata } from "next";
import ToolLayout from "@/app/components/layout/ToolLayout/ToolLayout";
import GameTabs from "@/app/herramientas/juegos/components/GameTabs/GameTabs";
import Bingo from "@/app/herramientas/juegos/components/Bingo/Bingo";

export const metadata: Metadata = {
    title: "Bingo virtual gratis (75 y 90 bolas) | Fortuno",
    description:
        "Juega al bingo online gratis. Saca números aleatorios para bingo de 75 o 90 bolas, lleva el historial de balotas llamadas y juega en grupo sin registro.",
};

export default function BingoPage() {
    return (
        <ToolLayout
            title="Bingo virtual"
            description="Juega al bingo tradicional de 75 o 90 bolas en línea. Saca números al azar, consulta las balotas llamadas y organiza partidas con amigos, familia o en clases sin registro."
            howItWorks={[
                "Selecciona la modalidad de juego: Bingo 75 o Bingo 90.",
                "Presiona «Sacar número» para extraer una balota aleatoria.",
                "Revisa el historial de números llamados y reinicia la partida cuando haya un ganador.",
            ]}
            faq={[
                {
                    question: "¿Qué diferencia hay entre Bingo 75 y Bingo 90?",
                    answer:
                        "El Bingo 75 utiliza balotas del 1 al 75 (formato americano), mientras que el Bingo 90 utiliza números del 1 al 90 (formato clásico o español).",
                },
                {
                    question: "¿Se pueden repetir los números?",
                    answer:
                        "No. Cada número extraído queda registrado en el historial y no volverá a salir hasta que reinicies la partida.",
                },
                {
                    question: "¿Necesito tarjetas o cartones?",
                    answer:
                        "Fortuno funciona como la tómbola o bolillero virtual que extrae los números. Los participantes pueden usar cartones físicos o digitales.",
                },
                {
                    question: "¿Tiene algún costo o requiere registro?",
                    answer:
                        "No. Puedes jugar al bingo virtual en Fortuno totalmente gratis y sin necesidad de crear una cuenta.",
                },
            ]}
            relatedTools={[
                {
                    title: "Piedra, papel o tijera",
                    href: "/herramientas/piedra-papel-o-tijera",
                },
                {
                    title: "Verdad o reto",
                    href: "/herramientas/verdad-o-reto",
                },
                {
                    title: "Lanzar dado",
                    href: "/herramientas/lanzar-dado",
                },
            ]}
        >
            <GameTabs activeTab="bingo" />
            <Bingo />
        </ToolLayout>
    );
}
