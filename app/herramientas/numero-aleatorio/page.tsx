import ToolLayout from "@/app/components/layout/ToolLayout/ToolLayout";
import GeneratorsTool from "../generadores/components/GeneratorsTool/GeneratorsTool";

export default function NumeroAleatorioPage() {
    return (
        <ToolLayout
            title="Generador de número aleatorio"
            description="Genera un número aleatorio entre un valor mínimo y máximo. Ideal para sorteos rápidos, dinámicas de clase, juegos y decisiones simples."
            howItWorks={[
                "Ingresa el valor mínimo y máximo del rango.",
                "Haz clic en «Generar».",
                "Fortuno elegirá un número aleatorio dentro del rango indicado.",
            ]}
            faq={[
                {
                    question: "¿Puedo usar números negativos?",
                    answer: "Sí. Puedes usar números negativos, positivos o cero.",
                },
                {
                    question: "¿Necesito registrarme?",
                    answer: "No. Puedes usar esta herramienta gratis y sin registro.",
                },
            ]}
            relatedTools={[
                { title: "Letra aleatoria", href: "/herramientas/letra-aleatoria" },
                { title: "Color aleatorio", href: "/herramientas/color-aleatorio" },
            ]}
        >
            <GeneratorsTool defaultMode="number" />
        </ToolLayout>
    );
}