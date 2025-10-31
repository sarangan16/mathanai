import { useAuth } from "../contexts/AuthContext";

export default function Layout({ children }) {
  const { logout } = useAuth();

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-white shadow-md p-4 flex flex-col">
        <h2 className="font-bold text-lg mb-6">Village Admin</h2>

        <nav className="space-y-3">
          <a
            className="block px-2 py-1 rounded hover:bg-gray-100"
            href="/dashboard"
          >
            Dashboard
          </a>
          <a
            className="block px-2 py-1 rounded hover:bg-gray-100"
            href="/people"
          >
            People
          </a>
          <a className="block px-2 py-1 rounded hover:bg-gray-100" href="/tree">
            Family Tree
          </a>
          <a
            className="block px-2 py-1 rounded hover:bg-gray-100"
            href="/events"
          >
            Events
          </a>
        </nav>

        <button
          onClick={logout}
          className="mt-auto bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* Page Content */}
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
