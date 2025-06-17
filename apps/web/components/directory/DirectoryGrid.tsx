import { MemberCard } from './MemberCard';

export function DirectoryGrid({
  members
}: {
  members: { id: string; name: string; role: string; email: string }[];
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {members.map(m => (
        <MemberCard key={m.id} {...m} />
      ))}
    </div>
  );
} 