import { Timer } from '@/components/time/Timer';

export default async function TimePage() {
  return (
    <main className="flex-1 p-6 pt-24 md:p-8 md:pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Time</h1>
        <p className="text-gray-600 mt-1">Track and review time entries</p>
      </div>
      <Timer />
    </main>
  );
}
