import Image from 'next/image';

export function MemberCard({
  name,
  role,
  email,
  avatar
}: {
  name: string;
  role: string;
  email: string;
  avatar?: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg border p-4 shadow-sm dark:border-gray-700">
      <Image
        src={avatar ?? `https://i.pravatar.cc/150?u=${email}`}
        alt={name}
        width={48}
        height={48}
        className="rounded-full"
      />
      <div className="flex-1">
        <p className="font-medium">{name}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
      <a href={`mailto:${email}`} className="text-sm text-indigo-600 hover:underline">
        Email
      </a>
    </div>
  );
} 