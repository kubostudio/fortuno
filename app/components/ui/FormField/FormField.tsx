import styles from "./FormField.module.css";

type FormFieldProps = {
    label: string;
    children: React.ReactNode;
    hint?: string;
};

export default function FormField({ label, children, hint }: FormFieldProps) {
    return (
        <label className={styles.field}>
            <span>{label}</span>
            {children}
            {hint && <small>{hint}</small>}
        </label>
    );
}