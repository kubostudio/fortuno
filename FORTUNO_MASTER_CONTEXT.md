# FORTUNO — MASTER CONTEXT

Versión: 1.0
Estado: MVP prácticamente terminado
Framework: Next.js (App Router)
Lenguaje: TypeScript
Estilos: CSS Modules
Fecha: 2026

---

# 1. VISIÓN

Fortuno es una plataforma peruana enfocada en sorteos.

El proyecto se divide en dos grandes etapas.

## Primera etapa

Generar tráfico orgánico mediante herramientas gratuitas.

Ejemplos:

- Generadores
- Sorteos
- Ruleta
- Grupos
- Juegos
- Amigo secreto

Estas herramientas monetizarán mediante anuncios.

## Segunda etapa

Plataforma profesional para:

- sorteos públicos
- rifas
- campañas
- promociones
- experiencias
- empresas

Fortuno cobrará:

- comisión por sorteo
- suscripción
- servicios premium

---

# 2. OBJETIVOS

Prioridad absoluta:

UX.

Después:

SEO.

Después:

Monetización.

Nunca sacrificar UX por anuncios.

---

# 3. TECNOLOGÍA

Next.js App Router

TypeScript

CSS Modules

Vercel

Google Search Console

Google Analytics

Google AdSense

robots.ts

sitemap.ts

Metadata API

---

# 4. FILOSOFÍA

No construir páginas.

Construir módulos.

Ejemplo.

Generadores

↓

Número

↓

Letra

↓

Color

Todos reutilizan el mismo componente.

Lo mismo para:

Sorteos

Grupos

Juegos

---

# 5. ARQUITECTURA

app/

components/

hooks/

lib/

herramientas/

---

components/

ui/

layout/

feedback/

graphics/

ads/

---

graphics/

Coin/

Dice/

---

layout/

Header/

Footer/

ToolLayout/

ContentPage/

---

feedback/

DrawLoader/

ResultCelebration/

---

ui/

Button/

FormField/

ResultCard/

---

hooks/

useCopyToClipboard()

---

lib/

random.ts

secretFriend.ts

---

# 6. HERRAMIENTAS IMPLEMENTADAS

## Generadores

Módulo principal.

Contiene:

- Número
- Letra
- Color

Rutas SEO:

/numero-aleatorio

/letra-aleatoria

/color-aleatoria

---

## Sorteos

Contiene:

- Nombres
- Premios

Opción:

Eliminar ganadores anteriores.

NO contiene equipos.

---

## Ruleta

Herramienta independiente.

Debe mantenerse visualmente atractiva.

Pendiente:

Segunda versión profesional.

---

## Grupos

Contiene:

- Equipos
- Roles

Se eliminó Parejas porque equipos de 2 personas resuelve el mismo caso.

Equipos puede formarse por:

- integrantes

o

- cantidad de equipos

---

## Amigo secreto

Actualmente:

local.

Roadmap:

salas privadas.

---

## Azar rápido

Contiene:

- Moneda

- Dado

---

## Juegos

Contiene:

Piedra Papel Tijera

Bingo

Verdad o reto

---

# 7. RUTAS SEO

Las rutas SEO NO tienen lógica.

Reutilizan módulos.

Ejemplo.

NumeroAleatorio

↓

GeneratorsTool

defaultMode="number"

---

# 8. DESIGN SYSTEM

Button

FormField

ResultCard

ToolLayout

ContentPage

Header

Footer

DrawLoader

ResultCelebration

Coin

Dice

RoleEditor

---

# 9. UX

Siempre priorizar.

No hacer interfaces complicadas.

No usar modales innecesarios.

No usar loaders largos.

Los resultados deben sentirse entretenidos.

---

# 10. ANUNCIOS

Solo en herramientas.

Nunca:

Landing.

Dashboard.

Premium.

Máximo:

Horizontal.

Sidebar.

No invadir UX.

---

# 11. SEO

Metadata.

OpenGraph.

Twitter.

robots.

sitemap.

URLs amigables.

Landing SEO.

Categorías.

Páginas SEO reutilizando módulos.

---

# 12. PÁGINAS

Landing

Herramientas

Cómo funciona

Contacto

Privacidad

Cookies

Términos

Próximamente

---

# 13. BRANDING

Nombre:

Fortuno

Personalidad:

Profesional.

Confiable.

Moderna.

Colores:

Azul.

Blanco.

Violeta.

Detalles dorados.

---

# 14. ROADMAP

## Corto plazo

Mejorar ruleta.

OpenGraph definitivo.

Responsive Review.

Lighthouse.

Analytics.

AdSense.

---

## Mediano plazo

Blog.

Artículos SEO.

---

## Largo plazo

Plataforma Premium.

---

# 15. PLATAFORMA PREMIUM

NO desarrollar todavía.

Cuando empiece.

Crear:

Crear sorteo.

Participantes.

Ventas.

Campañas.

Empresas.

Experiencias.

Historial.

Panel.

Pagos.

Comisiones.

---

# 16. NORMAS DE DESARROLLO

Siempre:

UX primero.

No duplicar componentes.

No mover código si no aporta valor.

Entregar archivos completos cuando el cambio sea grande.

Usar CSS Modules.

No usar Tailwind.

Pensar en escalabilidad.

---

# 17. COSAS IMPORTANTES DESCUBIERTAS

Las páginas SEO reutilizan módulos.

Parejas fue eliminada.

Equipos pertenece a Grupos.

Sorteos no forma equipos.

RoleEditor reemplaza textarea.

ToolLayout ya no usa breadcrumb.

Header y Footer son globales.

Las páginas institucionales usan ContentPage.

---

# 18. CONTEXTO PARA CHATGPT

Cuando se continúe este proyecto:

Asumir siempre que este documento representa el estado actual del proyecto.

No proponer reestructuraciones grandes salvo que aporten un beneficio claro.

Mantener la arquitectura existente.

Priorizar UX, SEO y reutilización.

Recordar que el objetivo final es una plataforma profesional de sorteos.