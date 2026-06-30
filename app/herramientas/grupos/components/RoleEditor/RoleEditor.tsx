"use client";

import Button from "@/app/components/ui/Button/Button";
import styles from "./RoleEditor.module.css";

export type RoleItem = {
    id: string;
    name: string;
    quantity: string;
};

type RoleEditorProps = {
    roles: RoleItem[];
    onChange: (roles: RoleItem[]) => void;
    disabled?: boolean;
};

export default function RoleEditor({
    roles,
    onChange,
    disabled = false,
}: RoleEditorProps) {
    function updateRole(id: string, field: "name" | "quantity", value: string) {
        onChange(
            roles.map((role) =>
                role.id === id
                    ? {
                        ...role,
                        [field]: value,
                    }
                    : role
            )
        );
    }

    function addRole() {
        onChange([
            ...roles,
            {
                id: crypto.randomUUID(),
                name: "",
                quantity: "1",
            },
        ]);
    }

    function removeRole(id: string) {
        if (roles.length === 1) return;
        onChange(roles.filter((role) => role.id !== id));
    }

    return (
        <div className={styles.editor}>
            <div className={styles.header}>
                <span>Rol</span>
                <span>Cantidad</span>
                <span />
            </div>

            <div className={styles.rows}>
                {roles.map((role) => (
                    <div key={role.id} className={styles.row}>
                        <input
                            type="text"
                            value={role.name}
                            placeholder="Ej. Líder"
                            onChange={(event) =>
                                updateRole(role.id, "name", event.target.value)
                            }
                            disabled={disabled}
                        />

                        <input
                            type="number"
                            min="1"
                            value={role.quantity}
                            onChange={(event) =>
                                updateRole(role.id, "quantity", event.target.value)
                            }
                            disabled={disabled}
                        />

                        <button
                            type="button"
                            className={styles.removeButton}
                            onClick={() => removeRole(role.id)}
                            disabled={disabled || roles.length === 1}
                            aria-label="Eliminar rol"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            <Button variant="secondary" onClick={addRole} disabled={disabled} fullWidth>
                + Agregar rol
            </Button>
        </div>
    );
}