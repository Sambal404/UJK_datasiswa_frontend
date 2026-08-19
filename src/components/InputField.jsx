export default function InputField({ 
    label, 
    type = "text", 
    name, 
    value, 
    onChange, 
    required = false,
    placeholder = "" 
}) {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label className="text-sm font-medium text-text">
                    {label} {required && <span className="text-danger">*</span>}
                </label>
            )}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className="px-3 py-2 text-sm bg-surface text-text border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
        </div>
    );
}