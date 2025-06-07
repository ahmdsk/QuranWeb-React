import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Moon, Sun } from 'lucide-react'
import { useState } from 'react'

export default function Landing() {
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Quran Web</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 hover:bg-accent"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <Link
              to="/home"
              className="inline-flex items-center space-x-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Discover the Holy Quran
              <span className="block text-primary">in a Modern Way</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Experience the beauty of the Quran with our modern, minimalist interface.
              Read, listen, and explore the divine words with ease.
            </p>
            <div className="flex space-x-4">
              <Link
                to="/home"
                className="inline-flex items-center space-x-2 rounded-lg bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
              >
                <span>Start Reading</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-8">
              <div className="h-full w-full rounded-xl bg-background/50 backdrop-blur-sm">
                {/* Add Quran illustration or image here */}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <BookOpen className="mb-4 h-8 w-8 text-primary" />
            <h3 className="mb-2 text-xl font-semibold">Complete Surah</h3>
            <p className="text-muted-foreground">
              Access all 114 surahs with accurate translations and transliterations.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <BookOpen className="mb-4 h-8 w-8 text-primary" />
            <h3 className="mb-2 text-xl font-semibold">Audio Recitation</h3>
            <p className="text-muted-foreground">
              Listen to beautiful recitations from renowned Qaris.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <BookOpen className="mb-4 h-8 w-8 text-primary" />
            <h3 className="mb-2 text-xl font-semibold">Bookmark & Notes</h3>
            <p className="text-muted-foreground">
              Save your favorite verses and add personal notes.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
} 