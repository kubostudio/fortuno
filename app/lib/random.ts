export function getRandomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffleArray<T>(items: T[]) {
    return [...items].sort(() => Math.random() - 0.5);
}

export function pickRandomItem<T>(items: T[]) {
    const index = getRandomInteger(0, items.length - 1);
    return items[index];
}

export function pickUniqueItems<T>(items: T[], count: number) {
    return shuffleArray(items).slice(0, count);
}

export function parseLines(text: string) {
    return text
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
}

export function hasDuplicates(items: string[]) {
    return new Set(items).size !== items.length;
}