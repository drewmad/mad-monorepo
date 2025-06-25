import clsx from 'clsx';
import { forwardRef } from 'react';

export const Table = forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(function Table({ className, ...props }, ref) {
  return (
    <table
      ref={ref}
      className={clsx('w-full text-sm', className)}
      {...props}
    />
  );
});
Table.displayName = 'Table';

export const TableHead = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(function TableHead({ className, ...props }, ref) {
  return (
    <thead
      ref={ref}
      className={clsx('text-xs uppercase text-gray-500 border-b border-gray-200', className)}
      {...props}
    />
  );
});
TableHead.displayName = 'TableHead';

export const TableBody = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(function TableBody({ className, ...props }, ref) {
  return (
    <tbody
      ref={ref}
      className={clsx('divide-y divide-gray-100', className)}
      {...props}
    />
  );
});
TableBody.displayName = 'TableBody';

export const TableRow = forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(function TableRow({ className, ...props }, ref) {
  return (
    <tr
      ref={ref}
      className={clsx('hover:bg-gray-50 transition-colors', className)}
      {...props}
    />
  );
});
TableRow.displayName = 'TableRow';

export const TableCell = forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(function TableCell({ className, ...props }, ref) {
  return (
    <td ref={ref} className={clsx('py-3 px-2', className)} {...props} />
  );
});
TableCell.displayName = 'TableCell';

export const TableHeaderCell = forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(function TableHeaderCell({ className, ...props }, ref) {
  return (
    <th ref={ref} className={clsx('py-3 px-2 text-left', className)} {...props} />
  );
});
TableHeaderCell.displayName = 'TableHeaderCell';
