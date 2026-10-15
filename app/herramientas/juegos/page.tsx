import type { Metadata } from "next";
import ToolLayout from "@/app/components/layout/ToolLayout/ToolLayout";
import GamesTool from "./components/GamesTool/GamesTool";

export const metadata: Metadata = {
    title: "Juegos aleatorios gratis | Fortuno",
    description:
        "Juega piedra, papel o tijera, bingo y verdad o reto gratis desde Fortuno.",
};

export default function JuegosPage() {
    return (
        <ToolLayout
            title="Juegos aleatorios"
            description="Juega piedra, papel o tijera, bingo y verdad o reto desde una sola herramienta. Ideal para reuniones, clases, grupos y momentos de diversión."
            howItWorks={[
                "Elige el juego que quieres usar.",
                "Sigue las instrucciones de cada modo.",
                "Fortuno generará resultados aleatorios para jugar fácilmente.",
            ]}
            faq={[
                {
                    question: "¿Qué juegos incluye esta herramienta?",
                    answer:
                        "Incluye piedra, papel o tijera, bingo y verdad o reto.",
                },
                {
                    question: "¿Necesito registrarme?",
                    answer:
                        "No. Puedes usar los juegos gratuitos de Fortuno sin crear una cuenta.",
                },
                {
                    question: "¿El bingo guarda los números llamados?",
                    answer:
                        "Sí, mientras no reinicies la partida o cierres la página, podrás ver el historial de números llamados.",
                },
            ]}
            relatedTools={[
                {
                    title: "Piedra, papel o tijera",
                    href: "/herramientas/piedra-papel-o-tijera",
                },
                {
                    title: "Bingo virtual",
                    href: "/herramientas/bingo",
                },
                {
                    title: "Verdad o reto",
                    href: "/herramientas/verdad-o-reto",
                },
            ]}
        >
            <GamesTool />
        </ToolLayout>
    );
}