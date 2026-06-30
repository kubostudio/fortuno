import ToolLayout from "@/app/components/layout/ToolLayout/ToolLayout";
import DiceRoller from "./components/DiceRoller/DiceRoller";

export default function LanzarDadoPage() {
    return (
        <ToolLayout
            title="Lanzar dado"
            description="Lanza un dado virtual de seis caras y obtén un número aleatorio del 1 al 6. Ideal para juegos, clases y decisiones rápidas."
            howItWorks={[
                "Presiona el botón para lanzar el dado.",
                "Fortuno generará un número aleatorio entre 1 y 6.",
                "Puedes copiar el resultado si necesitas compartirlo.",
            ]}
            faq={[
                {
                    question: "¿El dado es aleatorio?",
                    answer:
                        "Sí. La herramienta usa generación aleatoria del navegador para elegir un número entre 1 y 6.",
                },
                {
                    question: "¿Puedo usarlo gratis?",
                    answer:
                        "Sí. Puedes usar el dado virtual de Fortuno gratis y sin registrarte.",
                },
            ]}
            relatedTools={[
                {
                    title: "Lanzar moneda",
                    href: "/herramientas/lanzar-moneda",
                },
                {
                    title: "Número aleatorio",
                    href: "/herramientas/numero-aleatorio",
                },
            ]}
        >
            <DiceRoller />
        </ToolLayout>
    );
}