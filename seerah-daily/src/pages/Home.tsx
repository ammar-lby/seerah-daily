export default function Home() {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold heading-gradient">Learn the Seerah daily</h1>
        <p className="text-white/80 max-w-2xl mx-auto">
          One carefully curated question each day about the life of the Prophet Muhammad ﷺ. Answer, learn, and build a habit.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <a href="/daily" className="card-surface p-6 block">
          <h2 className="font-semibold mb-2">Today's Question</h2>
          <p className="text-white/70">Attempt the daily quiz and keep your streak alive.</p>
        </a>
        <a href="/practice" className="card-surface p-6 block">
          <h2 className="font-semibold mb-2">Practice Mode</h2>
          <p className="text-white/70">Review past questions anytime with explanations.</p>
        </a>
      </div>
    </section>
  )
}


