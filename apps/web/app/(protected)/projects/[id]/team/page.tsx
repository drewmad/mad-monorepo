interface TeamPageProps {
  params: { id: string };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { id } = params;

  return (
    <main className="flex-1 p-6 pt-24 md:p-8 md:pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Project Team</h1>
        <p className="text-gray-600 mt-1">Manage team members for project {id}</p>
      </div>
      {/* TODO: Implement team management */}
    </main>
  );
}
