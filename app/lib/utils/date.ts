/**
 * Utilidades de fecha para Fortuno 2.0.
 * Garantiza que todo se almacene en UTC-0 (ISO 8601 con sufijo 'Z')
 * y se muestre en la zona horaria local del navegador del usuario.
 */

/**
 * Convierte un string de fecha (ISO UTC-0) a una cadena amigable con fecha y hora en la zona horaria del usuario.
 * Ejemplo: "15 sep 2026, 7:00 p. m."
 */
export function formatFriendlyDateTime(dateStr: string): string {
    if (!dateStr) return "";
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;

        return date.toLocaleDateString("es-PE", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }).replace(/\u202f|\u00a0/g, " ");
    } catch {
        return dateStr;
    }
}

/**
 * Convierte un string de fecha (ISO UTC-0) a solo fecha amigable.
 * Ejemplo: "15 de septiembre de 2026"
 */
export function formatFriendlyDate(dateStr: string): string {
    if (!dateStr) return "";
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;

        return date.toLocaleDateString("es-PE", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }).replace(/\u202f|\u00a0/g, " ");
    } catch {
        return dateStr;
    }
}

/**
 * Convierte una fecha ISO UTC-0 al formato requerido por <input type="datetime-local" />
 * en la zona horaria local del usuario: "YYYY-MM-DDTHH:mm"
 */
export function toLocalDatetimeInputString(dateStr?: string): string {
    const date = dateStr ? new Date(dateStr) : new Date();
    if (isNaN(date.getTime())) return "";

    const pad = (num: number) => String(num).padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Convierte el valor de un <input type="datetime-local"> a un string ISO UTC-0 ('Z')
 * para guardado en Base de Datos / LocalStorage.
 */
export function toUTCISOString(localDatetimeStr: string): string {
    if (!localDatetimeStr) return new Date().toISOString();
    const date = new Date(localDatetimeStr);
    if (isNaN(date.getTime())) return new Date().toISOString();
    return date.toISOString();
}
