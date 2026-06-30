import ToolLayout from "@/app/components/layout/ToolLayout/ToolLayout";
import CoinFlipper from "./components/CoinFlipper/CoinFlipper";

export default function LanzarMonedaPage() {
    return (
        <ToolLayout
            title="Lanzar moneda"
            description="Lanza una moneda virtual y obtén cara o sello al azar. Ideal para tomar decisiones rápidas, juegos y dinámicas simples."
            howItWorks={[
                "Presiona el botón para lanzar la moneda.",
                "Fortuno elegirá aleatoriamente entre cara o sello.",
                "Puedes copiar el resultado si necesitas compartirlo.",
            ]}
            faq={[
                {
                    question: "¿El resultado es aleatorio?",
                    answer:
                        "Sí. La herramienta elige aleatoriamente entre cara y sello usando el navegador.",
                },
                {
                    question: "¿Necesito registrarme?",
                    answer:
                        "No. Puedes usar esta herramienta gratis y sin crear una cuenta.",
                },
            ]}
            relatedTools={[
                {
                    title: "Lanzar dado",
                    href: "/herramientas/lanzar-dado",
                },
                {
                    title: "Número aleatorio",
                    href: "/herramientas/numero-aleatorio",
                },
            ]}
        >
            <CoinFlipper />
        </ToolLayout>
    );
}