import ToolLayout from "@/app/components/layout/ToolLayout/ToolLayout";
import GeneratorsTool from "../generadores/components/GeneratorsTool/GeneratorsTool";

export default function LetraAleatoriaPage() {
    return (
        <ToolLayout
            title="Generador de letra aleatoria"
            description="Genera una letra aleatoria de la A a la Z en segundos. Útil para juegos, clases, dinámicas y decisiones rápidas."
            howItWorks={[
                "Selecciona el generador de letra.",
                "Haz clic en «Generar».",
                "Fortuno elegirá una letra aleatoria.",
            ]}
            faq={[
                {
                    question: "¿Qué letras puede generar?",
                    answer: "Genera letras del alfabeto de la A a la Z.",
                },
                {
                    question: "¿Es gratis?",
                    answer: "Sí. Puedes usarlo gratis y sin registrarte.",
                },
            ]}
            relatedTools={[
                { title: "Número aleatorio", href: "/herramientas/numero-aleatorio" },
                { title: "Color aleatorio", href: "/herramientas/color-aleatorio" },
            ]}
        >
            <GeneratorsTool defaultMode="letter" />
        </ToolLayout>
    );
}