import { Card, CardContent } from './Card';

export const KpiCard = ({
  title,
  value,
  change,
  icon
}: {
  title: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
}) => (
  <Card>
    <CardContent>
      <div className="flex items-center space-x-4">
        {icon && (
          <div className="rounded-lg bg-indigo-100 p-3 text-indigo-600">
            {icon}
          </div>
        )}
        <div>
          <p className="truncate text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
          {change && <p className="mt-1 text-xs text-gray-500">{change}</p>}
        </div>
      </div>
    </CardContent>
  </Card>
);
