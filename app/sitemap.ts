import type { MetadataRoute } from "next";

const baseUrl = "https://fortuno.pe";

const routes = [
    "",
    "/herramientas",
    "/herramientas/generadores",
    "/herramientas/numero-aleatorio",
    "/herramientas/letra-aleatoria",
    "/herramientas/color-aleatorio",
    "/herramientas/sorteos",
    "/herramientas/sorteo-de-nombres",
    "/herramientas/sorteo-de-premios",
    "/herramientas/ruleta",
    "/herramientas/grupos",
    "/herramientas/formar-equipos",
    "/herramientas/formar-parejas",
    "/herramientas/asignar-roles",
    "/herramientas/amigo-secreto",
    "/herramientas/azar-rapido",
    "/herramientas/lanzar-moneda",
    "/herramientas/lanzar-dado",
    "/herramientas/juegos",
];

export default function sitemap(): MetadataRoute.Sitemap {
    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: route === "" ? 1 : route === "/herramientas" ? 0.9 : 0.8,
    }));
}