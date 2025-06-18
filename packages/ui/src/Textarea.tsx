import clsx from 'clsx';

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
}

export const Textarea = ({ label, className, ...props }: Props) => (
    <div className="space-y-1">
        {label && <label className="text-sm font-medium">{label}</label>}
        <textarea
            {...props}
            className={clsx(
                'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm',
                className
            )}
        />
    </div>
); 