'use client';

import clsx from 'clsx';
import { useState, useRef, useEffect } from 'react';

interface DropdownProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    align?: 'left' | 'right';
    className?: string;
}

export const Dropdown = ({
    trigger,
    children,
    align = 'left',
    className
}: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)}>
                {trigger}
            </div>

            {isOpen && (
                <div
                    className={clsx(
                        'absolute z-50 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5',
                        {
                            'left-0': align === 'left',
                            'right-0': align === 'right'
                        },
                        className
                    )}
                >
                    {children}
                </div>
            )}
        </div>
    );
};

interface DropdownItemProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}

export const DropdownItem = ({
    children,
    onClick,
    className,
    disabled = false
}: DropdownItemProps) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={clsx(
            'block w-full px-4 py-2 text-left text-sm transition-colors',
            disabled
                ? 'cursor-not-allowed text-gray-400'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
            className
        )}
    >
        {children}
    </button>
); 