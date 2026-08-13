# FORTUNO --- MASTER CONTEXT v2.0

> Documento maestro del proyecto. Úsalo como contexto al iniciar una
> nueva conversación.

## 1. Resumen ejecutivo

Fortuno es una plataforma enfocada en herramientas gratuitas de azar
(para atraer tráfico orgánico) y una futura plataforma profesional de
sorteos de pago.

### Objetivos

-   UX primero.
-   SEO desde el diseño.
-   Código simple y reutilizable.
-   Evolucionar hacia SaaS de sorteos.

## 2. Stack tecnológico

-   Next.js (App Router)
-   TypeScript
-   CSS Modules
-   Vercel
-   Google Search Console
-   Google Analytics / Vercel Analytics
-   Google AdSense
-   Metadata API
-   robots.ts / sitemap.ts

## 3. Principios

-   No usar Tailwind.
-   No sobreingeniería.
-   Componentes reutilizables.
-   Los módulos concentran lógica.
-   Las páginas SEO solo reutilizan módulos.

## 4. Arquitectura

    app/
      components/
        ui/
        layout/
        feedback/
        graphics/
        ads/
      hooks/
      lib/
      herramientas/

### UI

-   Button
-   FormField
-   ResultCard

### Layout

-   Header
-   Footer
-   ToolLayout
-   ContentPage

### Feedback

-   DrawLoader
-   ResultCelebration

### Graphics

-   Coin
-   Dice

### Lib

-   random.ts
-   secretFriend.ts

### Hooks

-   useCopyToClipboard

## 5. Módulos

### Generadores

-   Número
-   Letra
-   Color

SEO: - /herramientas/numero-aleatorio - /herramientas/letra-aleatoria -
/herramientas/color-aleatorio

### Sorteos

-   Nombres
-   Premios
-   Eliminar ganadores anteriores

### Grupos

-   Equipos
-   Roles

Equipos: - por integrantes - por cantidad de equipos

### Ruleta

Herramienta independiente. Pendiente: - versión visual 2.0

### Amigo secreto

Versión local terminada. Roadmap: - salas privadas - enlaces únicos

### Azar rápido

-   Moneda
-   Dado

### Juegos

-   Piedra, papel o tijera
-   Bingo 75/90
-   Verdad o reto

## 6. SEO

-   Metadata por página
-   Sitemap
-   Robots
-   OpenGraph
-   Twitter Cards
-   URLs amigables

## 7. Monetización

Primera etapa: - AdSense (solo herramientas)

Segunda etapa: - SaaS de sorteos - Comisión - Suscripciones

## 8. UX

-   Animaciones cortas.
-   Sin esperas innecesarias.
-   Responsive.
-   Mobile first.

## 9. Branding

Nombre: Fortuno

Personalidad: - Profesional - Confiable - Moderna

## 10. Roadmap

### RC1

-   Revisar UX
-   Responsive
-   Lighthouse
-   Analytics
-   AdSense

### RC2

-   Blog
-   Artículos SEO

### v2

-   Plataforma premium

## 11. Backlog

-   Mejorar ruleta.
-   Buscador.
-   Mega menú refinado.
-   OpenGraph definitivo.
-   Dominio propio.
-   Schema.org.

## 12. Normas para continuar el proyecto

-   Mantener arquitectura.
-   No refactorizar sin beneficio claro.
-   Entregar archivos completos cuando el cambio sea grande.
-   Priorizar UX, SEO y simplicidad.
