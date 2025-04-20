import { SideBar } from "@repo/ui/SideBar"

export default function page() {
    return (
        <div className="h-full w-[70%] flex flex-col justify-center p-6 text-white">
            <h1 className="text-4xl font-bold mb-4 text-cyan-400">Welcome to ChatConnect</h1>
            <p className="text-lg text-gray-300 mb-4">
                ChatConnect is a sleek and secure real-time chat app built for modern communication. Whether it's casual conversation or team collaboration, experience messaging like never before.
            </p>
            <ul className="list-disc pl-6 text-gray-400 space-y-2">
                <li>🔒 End-to-end encrypted messages</li>
                <li>💬 Real-time messaging with typing indicators</li>
                <li>📁 Media and file sharing support</li>
                <li>🌓 Optimized for dark mode</li>
                <li>🧑‍🤝‍🧑 Group chat and private messaging</li>
            </ul>
        </div>


    )
}