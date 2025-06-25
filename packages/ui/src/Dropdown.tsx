'use client';

import clsx from 'clsx';
import { useState, useRef, useEffect } from 'react';

interface DropdownProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    align?: 'left' | 'right';
    className?: string;
    /**
     * When true, the dropdown opens on hover or focus instead of click.
     */
    openOnHover?: boolean;
}

export const Dropdown = ({
    trigger,
    children,
    align = 'left',
    className,
    openOnHover = false
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

    const openMenu = () => setIsOpen(true);
    const closeMenu = () => setIsOpen(false);
    const toggleMenu = () => setIsOpen((prev) => !prev);

    const triggerProps = openOnHover
        ? {
              onMouseEnter: openMenu,
              onFocus: openMenu,
              onBlur: (e: React.FocusEvent) => {
                  if (
                      dropdownRef.current &&
                      e.relatedTarget &&
                      dropdownRef.current.contains(e.relatedTarget as Node)
                  ) {
                      return;
                  }
                  closeMenu();
              }
          }
        : { onClick: toggleMenu };

    const containerProps = openOnHover
        ? { onMouseLeave: closeMenu }
        : {};

    return (
        <div className="relative inline-block" ref={dropdownRef} {...containerProps}>
            <div {...triggerProps}>{trigger}</div>

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
