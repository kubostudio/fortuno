"use client";

import { useState } from "react";

import Button from "@/app/components/ui/Button/Button";
import DrawLoader from "@/app/components/feedback/DrawLoader/DrawLoader";
import FormField from "@/app/components/ui/FormField/FormField";
import ResultCard from "@/app/components/ui/ResultCard/ResultCard";
import { useCopyToClipboard } from "@/app/hooks/useCopyToClipboard";
import { parseLines, shuffleArray } from "@/app/lib/random";
import RoleEditor, { type RoleItem } from "../RoleEditor/RoleEditor";

import styles from "./GroupsTool.module.css";

export type GroupMode = "teams" | "roles";

type RoleAssignment = {
    participant: string;
    role: string;
};

type GroupsToolProps = {
    defaultMode?: GroupMode;
};

export default function GroupsTool({ defaultMode = "teams" }: GroupsToolProps) {
    const [mode, setMode] = useState<GroupMode>(defaultMode);
    const [participantsText, setParticipantsText] = useState(
        "Ana\nLuis\nMaría\nCarlos\nLucía\nPedro"
    );
    const [roles, setRoles] = useState<RoleItem[]>([
        { id: "role-1", name: "Líder", quantity: "1" },
        { id: "role-2", name: "Expositor", quantity: "2" },
        { id: "role-3", name: "Investigador", quantity: "3" },
    ]);
    const [membersPerTeam, setMembersPerTeam] = useState("2");
    const [teamMode, setTeamMode] = useState<"bySize" | "byCount">("bySize");
    const [teamCount, setTeamCount] = useState("2");

    const [groups, setGroups] = useState<string[][]>([]);
    const [roleAssignments, setRoleAssignments] = useState<RoleAssignment[]>([]);
    const [error, setError] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const { copy, hasCopied } = useCopyToClipboard();

    const participants = parseLines(participantsText);
    const expandedRoles = roles.flatMap((role) => {
        const quantity = Number(role.quantity);

        if (!role.name.trim() || !Number.isInteger(quantity) || quantity < 1) {
            return [];
        }

        return Array.from({ length: quantity }, () => role.name.trim());
    });

    function resetResults() {
        setGroups([]);
        setRoleAssignments([]);
        setError("");
    }

    function changeMode(nextMode: GroupMode) {
        setMode(nextMode);
        resetResults();
    }

    function generateGroups() {
        resetResults();

        if (participants.length < 2) {
            setError("Agrega al menos 2 participantes.");
            return;
        }

        setIsGenerating(true);

        setTimeout(() => {
            if (mode === "teams") {
                createTeams();
            }

            if (mode === "roles") {
                assignRoles();
            }

            setIsGenerating(false);
        }, 1200);
    }

    function createTeams() {
        const shuffled = shuffleArray(participants);
        const newGroups: string[][] = [];

        if (teamMode === "bySize") {
            const size = Number(membersPerTeam);

            if (!Number.isInteger(size) || size < 1) {
                setError("Ingresa una cantidad válida de integrantes por equipo.");
                return;
            }

            for (let index = 0; index < shuffled.length; index += size) {
                newGroups.push(shuffled.slice(index, index + size));
            }
        }

        if (teamMode === "byCount") {
            const count = Number(teamCount);

            if (!Number.isInteger(count) || count < 1) {
                setError("Ingresa una cantidad válida de equipos.");
                return;
            }

            if (count > participants.length) {
                setError("La cantidad de equipos no puede superar los participantes.");
                return;
            }

            for (let index = 0; index < count; index++) {
                newGroups.push([]);
            }

            shuffled.forEach((participant, index) => {
                newGroups[index % count].push(participant);
            });
        }

        setGroups(newGroups);
    }

    function assignRoles() {
        if (expandedRoles.length < 1) {
            setError("Agrega al menos 1 rol con una cantidad válida.");
            return;
        }

        if (expandedRoles.length < participants.length) {
            setError(
                `Faltan ${participants.length - expandedRoles.length} roles por asignar.`
            );
            return;
        }

        const shuffledParticipants = shuffleArray(participants);
        const shuffledRoles = shuffleArray(expandedRoles);

        const assignments = shuffledParticipants.map((participant, index) => ({
            participant,
            role: shuffledRoles[index],
        }));

        setRoleAssignments(assignments);
    }

    function copyResults() {
        if (mode === "roles") {
            const text = roleAssignments
                .map((item, index) => `${index + 1}. ${item.participant}: ${item.role}`)
                .join("\n");

            copy(`Roles asignados:\n${text}`);
            return;
        }

        const title = "Equipos formados";

        const text = groups
            .map(
                (group, index) =>
                    `"Equipo" ${index + 1}: ${group.join(
                        ", "
                    )}`
            )
            .join("\n");

        copy(`${title}:\n${text}`);
    }

    const hasResult = groups.length > 0 || roleAssignments.length > 0;

    return (
        <div className={styles.tool}>
            <div className={styles.modeGrid}>
                <button
                    type="button"
                    className={mode === "teams" ? styles.activeMode : ""}
                    onClick={() => changeMode("teams")}
                >
                    Equipos
                </button>

                <button
                    type="button"
                    className={mode === "roles" ? styles.activeMode : ""}
                    onClick={() => changeMode("roles")}
                >
                    Roles
                </button>
            </div>

            <FormField label="Participantes" hint="Escribe un nombre por línea.">
                <textarea
                    value={participantsText}
                    onChange={(event) => {
                        setParticipantsText(event.target.value);
                        resetResults();
                    }}
                    rows={8}
                    placeholder="Ana&#10;Luis&#10;María&#10;Carlos"
                    disabled={isGenerating}
                />
            </FormField>

            {mode === "teams" && (
                <div className={styles.teamOptions}>
                    <div className={styles.switchGrid}>
                        <button
                            type="button"
                            className={teamMode === "bySize" ? styles.activeMode : ""}
                            onClick={() => {
                                setTeamMode("bySize");
                                resetResults();
                            }}
                        >
                            Por integrantes
                        </button>

                        <button
                            type="button"
                            className={teamMode === "byCount" ? styles.activeMode : ""}
                            onClick={() => {
                                setTeamMode("byCount");
                                resetResults();
                            }}
                        >
                            Por cantidad de equipos
                        </button>
                    </div>

                    {teamMode === "bySize" ? (
                        <FormField label="Integrantes por equipo">
                            <input
                                type="number"
                                min="1"
                                value={membersPerTeam}
                                onChange={(event) => {
                                    setMembersPerTeam(event.target.value);
                                    resetResults();
                                }}
                                disabled={isGenerating}
                            />
                        </FormField>
                    ) : (
                        <FormField label="Cantidad de equipos">
                            <input
                                type="number"
                                min="1"
                                value={teamCount}
                                onChange={(event) => {
                                    setTeamCount(event.target.value);
                                    resetResults();
                                }}
                                disabled={isGenerating}
                            />
                        </FormField>
                    )}
                </div>
            )}

            {mode === "roles" && (
                <div className={styles.roleSection}>
                    <div>
                        <strong>Roles</strong>
                        <p>
                            Define cada rol y cuántas personas deben recibirlo.
                        </p>
                    </div>

                    <RoleEditor
                        roles={roles}
                        onChange={(nextRoles) => {
                            setRoles(nextRoles);
                            resetResults();
                        }}
                        disabled={isGenerating}
                    />
                </div>
            )}

            <div className={styles.summaryGrid}>
                <div>
                    <strong>{participants.length}</strong>
                    <span>Participantes</span>
                </div>

                {mode === "roles" && (
                    <div>
                        <strong>{expandedRoles.length}</strong>
                        <span>Roles disponibles</span>
                    </div>
                )}
            </div>

            <Button onClick={generateGroups} disabled={isGenerating} fullWidth>
                {isGenerating
                    ? "Generando..."
                    : mode === "teams"
                        ? "Formar equipos"
                        : "Asignar roles"}
            </Button>

            {error && <p className={styles.error}>{error}</p>}

            {isGenerating && <DrawLoader text="Organizando participantes..." />}

            {hasResult && !isGenerating && (
                <div className={styles.resultGroup}>
                    <ResultCard
                        label={mode === "teams" ? "Equipos formados" : "Roles asignados"}
                        celebration="winner"
                        size="compact"
                    >
                        {mode === "roles" ? (
                            <ol className={styles.assignmentList}>
                                {roleAssignments.map((item, index) => (
                                    <li key={`${item.participant}-${item.role}-${index}`}>
                                        <span>{item.participant}</span>
                                        <strong>{item.role}</strong>
                                    </li>
                                ))}
                            </ol>
                        ) : (
                            <ol className={styles.groupList}>
                                {groups.map((group, index) => (
                                    <li key={`${group.join("-")}-${index}`}>
                                        <span>
                                            `Equipo ${index + 1}: ${group.join(", ")}`
                                        </span>
                                        <strong>{group.join(", ")}</strong>
                                    </li>
                                ))}
                            </ol>
                        )}
                    </ResultCard>

                    <Button variant="secondary" onClick={copyResults} fullWidth>
                        {hasCopied ? "Resultado copiado" : "Copiar resultado"}
                    </Button>
                </div>
            )}
        </div>
    );
}