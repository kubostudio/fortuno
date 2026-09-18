"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollReveal() {
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window === "undefined") return;

        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) return;

        let observer: IntersectionObserver | null = null;

        const setupObserver = () => {
            const elements = document.querySelectorAll(
                "main > section, main > article, .reveal, article, [data-reveal]"
            );

            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("revealed");
                            observer?.unobserve(entry.target);
                        }
                    });
                },
                {
                    root: null,
                    rootMargin: "0px 0px -40px 0px",
                    threshold: 0.08,
                }
            );

            elements.forEach((el) => {
                // Ignore headers, modals or elements that opt out
                if (el.closest("dialog") || el.hasAttribute("data-no-reveal")) return;

                el.classList.add("reveal-on-scroll");

                const rect = el.getBoundingClientRect();
                // If element is already visible in viewport on initial load, reveal immediately
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    el.classList.add("revealed");
                } else {
                    observer?.observe(el);
                }
            });
        };

        // Delay slightly for hydration & dynamic component rendering
        const timer = setTimeout(setupObserver, 60);

        // Also observe dynamic DOM changes (e.g. tab filters or tool results)
        const mutationObserver = new MutationObserver(() => {
            const newElements = document.querySelectorAll(
                "main > section:not(.reveal-on-scroll), article:not(.reveal-on-scroll), [data-reveal]:not(.reveal-on-scroll)"
            );
            newElements.forEach((el) => {
                if (el.closest("dialog") || el.hasAttribute("data-no-reveal")) return;
                el.classList.add("reveal-on-scroll");
                observer?.observe(el);
            });
        });

        mutationObserver.observe(document.body, { childList: true, subtree: true });

        return () => {
            clearTimeout(timer);
            if (observer) observer.disconnect();
            mutationObserver.disconnect();
        };
    }, [pathname]);

    return null;
}
