export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900 font-sans">
      <main className="w-full max-w-4xl px-6 py-12">
        <div className="relative bg-linear-to-br from-emerald-400 via-teal-400 to-cyan-400 dark:from-emerald-600 dark:via-teal-600 dark:to-cyan-600 p-12 rounded-3xl shadow-2xl overflow-hidden">
          <div
            className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-white/30 dark:to-black/30 opacity-0 animate-pulse pointer-events-none"
            style={{ animationDuration: '3s' }}
          ></div>

          <div
            className="absolute -top-20 -right-20 w-64 h-64 bg-teal-300 dark:bg-teal-500 rounded-full blur-3xl opacity-30 animate-pulse"
            style={{ animationDuration: '4s' }}
          ></div>
          <div
            className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-300 dark:bg-cyan-500 rounded-full blur-3xl opacity-30 animate-pulse"
            style={{ animationDuration: '5s', animationDelay: '1s' }}
          ></div>

          <div className="relative z-10 space-y-8">
            <div className="text-center space-y-3">
              <h1 className="font-bold text-4xl md:text-5xl text-white drop-shadow-lg">
                GitHub Repository Search
              </h1>
              <p className="text-emerald-50 text-lg">
                Discover amazing projects and repositories
              </p>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-2xl">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-linear-to-r from-teal-300 to-cyan-300 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                  <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="flex items-center p-6 gap-4">
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search repositories..."
                        className="flex-1 bg-transparent text-gray-800 dark:text-white text-lg outline-none placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {['React', 'TypeScript', 'Python', 'Next.js', 'AI/ML'].map(
                    (tag) => (
                      <button
                        key={tag}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full text-sm font-medium transition duration-200 hover:scale-105"
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
