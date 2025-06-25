import clsx from 'clsx';
import React from 'react';

export const Card = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    {...props}
    className={clsx(
      'rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800/50',
      className
    )}
  />
);

export const CardHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props} className={clsx('p-4', className)} />
);

export const CardContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props} className={clsx('p-6', className)} />
);

export const CardFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    {...props}
    className={clsx('border-t bg-gray-50 p-4 dark:bg-gray-800/50', className)}
  />
);

export const CardTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    {...props}
    className={clsx(
      'text-lg font-semibold text-gray-900 dark:text-gray-100',
      className
    )}
  />
);
