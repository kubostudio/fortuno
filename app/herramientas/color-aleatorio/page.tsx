import ToolLayout from "@/app/components/layout/ToolLayout/ToolLayout";
import GeneratorsTool from "../generadores/components/GeneratorsTool/GeneratorsTool";

export default function ColorAleatorioPage() {
    return (
        <ToolLayout
            title="Generador de color aleatorio"
            description="Genera un color aleatorio en formato hexadecimal. Ideal para diseño, pruebas visuales, juegos y proyectos creativos."
            howItWorks={[
                "Selecciona el generador de color.",
                "Haz clic en «Generar».",
                "Fortuno creará un color hexadecimal aleatorio.",
            ]}
            faq={[
                {
                    question: "¿En qué formato sale el color?",
                    answer: "El color se muestra en formato hexadecimal, por ejemplo #2563EB.",
                },
                {
                    question: "¿Puedo copiar el color?",
                    answer: "Sí. Puedes copiar el resultado con un clic.",
                },
            ]}
            relatedTools={[
                { title: "Número aleatorio", href: "/herramientas/numero-aleatorio" },
                { title: "Letra aleatoria", href: "/herramientas/letra-aleatoria" },
            ]}
        >
            <GeneratorsTool defaultMode="color" />
        </ToolLayout>
    );
}