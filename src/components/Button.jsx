export default function Button({ 
    children, 
    variant = "primary", 
    type = "button", 
    onClick, 
    disabled = false 
}) {
    // Memetakan warna dari tema kustom Tailwind kamu
    const variants = {
        primary: "bg-primary text-white hover:bg-primary-dark",
        secondary: "bg-surface text-text border border-border hover:bg-background",
        danger: "bg-danger text-white hover:opacity-95",
        success: "bg-success text-white hover:opacity-95",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                inline-flex items-center justify-center
                rounded-md px-4 py-2 text-sm font-medium
                transition disabled:opacity-50 disabled:cursor-not-allowed
                ${variants[variant]}
            `}
        >
            {children}
        </button>
    );
}