import styles from "./Button.module.css";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger";
    fullWidth?: boolean;
};

export default function Button({
    variant = "primary",
    fullWidth = false,
    className = "",
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`${styles.button} ${styles[variant]} ${fullWidth ? styles.fullWidth : ""
                } ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}