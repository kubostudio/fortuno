"use client";

import { useState } from "react";
import Button from "@/app/components/ui/Button/Button";
import ResultCard from "@/app/components/ui/ResultCard/ResultCard";

import styles from "./SecretAssignments.module.css";

type Assignment = {
    giver: string;
    receiver: string;
};

type SecretAssignmentsProps = {
    assignments: Assignment[];
};

export default function SecretAssignments({
    assignments,
}: SecretAssignmentsProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    const currentAssignment = assignments[currentIndex];
    const isLast = currentIndex === assignments.length - 1;

    function goNext() {
        setIsVisible(false);

        if (!isLast) {
            setCurrentIndex((current) => current + 1);
        }
    }

    function restart() {
        setCurrentIndex(0);
        setIsVisible(false);
    }

    if (!currentAssignment) {
        return null;
    }

    return (
        <div className={styles.assignments}>
            <div className={styles.progress}>
                Participante {currentIndex + 1} de {assignments.length}
            </div>

            <div className={styles.card}>
                <span className={styles.label}>Turno de</span>
                <strong>{currentAssignment.giver}</strong>
                <p>
                    Pasa el dispositivo a esta persona y presiona el botón solo cuando
                    esté lista para ver su amigo secreto.
                </p>
            </div>

            {!isVisible && (
                <Button onClick={() => setIsVisible(true)} fullWidth>
                    Mostrar mi amigo secreto
                </Button>
            )}

            {isVisible && (
                <>
                    <ResultCard label="Tu amigo secreto es" celebration="winner">
                        {currentAssignment.receiver}
                    </ResultCard>

                    <div className={styles.actions}>
                        <Button variant="secondary" onClick={() => setIsVisible(false)}>
                            Ocultar
                        </Button>

                        {!isLast ? (
                            <Button onClick={goNext}>Siguiente participante</Button>
                        ) : (
                            <Button onClick={restart}>Ver desde el inicio</Button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}