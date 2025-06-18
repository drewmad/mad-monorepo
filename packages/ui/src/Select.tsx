import clsx from 'clsx';

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { value: string; label: string }[];
}

export const Select = ({ label, className, options, ...props }: Props) => (
    <div className="space-y-1">
        {label && <label className="text-sm font-medium">{label}</label>}
        <select
            {...props}
            className={clsx(
                'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm',
                className
            )}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
); 