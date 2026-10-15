import type { Metadata } from "next";
import ToolLayout from "@/app/components/layout/ToolLayout/ToolLayout";
import GameTabs from "@/app/herramientas/juegos/components/GameTabs/GameTabs";
import RockPaperScissors from "@/app/herramientas/juegos/components/RockPaperScissors/RockPaperScissors";

export const metadata: Metadata = {
    title: "Piedra, papel o tijera online gratis | Fortuno",
    description:
        "Juega piedra, papel o tijera contra la computadora. Elige tu jugada y deja que Fortuno decida al instante de forma justa y divertida.",
};

export default function PiedraPapelOTijeraPage() {
    return (
        <ToolLayout
            title="Piedra, papel o tijera"
            description="Juega al clásico piedra, papel o tijera contra Fortuno. Elige tu jugada y obtén un resultado aleatorio al instante para resolver retos, tomar decisiones o divertirte."
            howItWorks={[
                "Elige tu jugada haciendo clic en Piedra (✊), Papel (✋) o Tijera (✌️).",
                "Fortuno elegirá su jugada al azar de forma instantánea.",
                "Descubre quién ganó según las reglas clásicas del juego.",
            ]}
            faq={[
                {
                    question: "¿Cuáles son las reglas?",
                    answer:
                        "La piedra vence a la tijera, la tijera vence al papel y el papel vence a la piedra. Si ambos eligen la misma opción, es un empate.",
                },
                {
                    question: "¿Cómo elige Fortuno su jugada?",
                    answer:
                        "Fortuno genera una elección 100% aleatoria e imparcial en cada turno.",
                },
                {
                    question: "¿Puedo jugar varias veces?",
                    answer:
                        "Sí, puedes jugar tantas partidas como desees sin límite alguno.",
                },
            ]}
            relatedTools={[
                {
                    title: "Lanzar moneda",
                    href: "/herramientas/lanzar-moneda",
                },
                {
                    title: "Lanzar dado",
                    href: "/herramientas/lanzar-dado",
                },
                {
                    title: "Verdad o reto",
                    href: "/herramientas/verdad-o-reto",
                },
            ]}
        >
            <GameTabs activeTab="rps" />
            <RockPaperScissors />
        </ToolLayout>
    );
}
