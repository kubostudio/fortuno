"use client";

import { useState } from "react";

import Button from "@/app/components/ui/Button/Button";
import DrawLoader from "@/app/components/feedback/DrawLoader/DrawLoader";
import FormField from "@/app/components/ui/FormField/FormField";
import { hasDuplicates, parseLines } from "@/app/lib/random";
import {
    createSecretFriendAssignments,
    type SecretFriendAssignment,
} from "@/app/lib/secretFriend";

import SecretAssignments from "../SecretAssignments/SecretAssignments";
import styles from "./SecretFriendGenerator.module.css";

export default function SecretFriendGenerator() {
    const [names, setNames] = useState("Ana\nLuis\nMaría\nCarlos\nLucía");
    const [assignments, setAssignments] = useState<SecretFriendAssignment[]>([]);
    const [error, setError] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const participants = parseLines(names);

    function generateAssignments() {
        if (participants.length < 3) {
            setError("Agrega al menos 3 participantes.");
            setAssignments([]);
            return;
        }

        if (hasDuplicates(participants)) {
            setError("Hay nombres repetidos. Cada participante debe ser único.");
            setAssignments([]);
            return;
        }

        const newAssignments = createSecretFriendAssignments(participants);

        setError("");
        setAssignments([]);
        setIsGenerating(true);

        setTimeout(() => {
            setAssignments(newAssignments);
            setIsGenerating(false);
        }, 1200);
    }

    return (
        <div className={styles.secretTool}>
            <FormField
                label="Participantes"
                hint="Escribe un nombre por línea. Cada nombre debe ser único."
            >
                <textarea
                    value={names}
                    onChange={(event) => {
                        setNames(event.target.value);
                        setAssignments([]);
                    }}
                    rows={8}
                    placeholder="Ana&#10;Luis&#10;María&#10;Carlos"
                    disabled={isGenerating}
                />
            </FormField>

            <div className={styles.summary}>{participants.length} participantes</div>

            <Button onClick={generateAssignments} disabled={isGenerating} fullWidth>
                {isGenerating ? "Generando..." : "Generar amigo secreto"}
            </Button>

            {error && <p className={styles.error}>{error}</p>}

            {isGenerating && <DrawLoader text="Generando asignaciones..." />}

            {assignments.length > 0 && !isGenerating && (
                <SecretAssignments assignments={assignments} />
            )}
        </div>
    );
}