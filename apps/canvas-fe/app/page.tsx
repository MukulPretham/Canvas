import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-3 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold">ChatBridge</h1>
        <div className="space-x-3">
          <Link href="/login">
            <button className="px-4 py-1.5 bg-black text-white rounded-xl hover:opacity-80 transition dark:bg-white dark:text-black">
              Log In
            </button>
          </Link>
          <Link href="/signup">
            <button className="px-4 py-1.5 border border-black text-black rounded-xl hover:bg-black hover:text-white transition dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black">
              Sign Up
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center px-6">
        <div className="text-center max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Connect. Communicate. Collaborate.
          </h2>
          <p className="text-lg md:text-xl mb-8">
            Real-time messaging for teams and friends — chat anytime, anywhere, all inside your browser.
          </p>
          <div className="space-x-4">
            <button className="px-6 py-3 bg-black text-white font-semibold rounded-xl hover:opacity-80 transition dark:bg-white dark:text-black">
              Start Chatting
            </button>
            <button className="px-6 py-3 border border-black text-black font-semibold rounded-xl hover:bg-black hover:text-white transition dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black">
              Learn More
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm py-4 border-t border-gray-200 dark:border-gray-800">
        © {new Date().getFullYear()} ChatBridge. All rights reserved.
      </footer>
    </div>
  );
}
