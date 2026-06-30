"use client";

import { useState } from "react";

export function useCopyToClipboard() {
    const [hasCopied, setHasCopied] = useState(false);

    async function copy(text: string) {
        try {
            await navigator.clipboard.writeText(text);
            setHasCopied(true);

            setTimeout(() => {
                setHasCopied(false);
            }, 1800);
        } catch {
            setHasCopied(false);
        }
    }

    return {
        copy,
        hasCopied,
    };
}