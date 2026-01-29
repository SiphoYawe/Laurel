export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-laurel-600 mb-4 text-4xl font-bold">🌿 Laurel</h1>
        <p className="text-muted-foreground max-w-md text-lg">
          AI-powered habit coaching using Atomic Habits methodology and evidence-based learning
          techniques.
        </p>
        <div className="bg-laurel-50 border-laurel-200 mt-8 rounded-lg border p-4">
          <p className="text-laurel-700 text-sm">✅ Monorepo initialized successfully</p>
        </div>
      </div>
    </main>
  );
}
