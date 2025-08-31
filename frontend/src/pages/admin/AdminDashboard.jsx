import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import {
  Menu,
  Users,
  Briefcase,
  Calendar,
  Building,
  SlidersHorizontal,
  Settings,
  LogOut,
  Key,
  User,
  LayoutGrid,
} from "lucide-react";
import PasswordManager from "../../components/PasswordManager";

// Dummy page components (replace with real ones later)
const GuidesPage = () => (
  <div className="p-6 text-white">📘 Manage Guides Page</div>
);
const GroupsPage = () => (
  <div className="p-6 text-white">👥 Manage Groups Page</div>
);
const ProjectsPage = () => (
  <div className="p-6 text-white">💼 Manage Projects Page</div>
);
const SchedulesPage = () => (
  <div className="p-6 text-white">🗓️ Exam Schedules Page</div>
);
const DivisionsPage = () => (
  <div className="p-6 text-white">🏫 Manage Divisions Page</div>
);
const EvaluationPage = () => (
  <div className="p-6 text-white">📊 Evaluation Parameters Page</div>
);

function Dashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const settingsMenuRef = useRef(null);
  const settingsIconRef = useRef(null);

  // Close settings dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        settingsMenuRef.current &&
        !settingsMenuRef.current.contains(event.target) &&
        settingsIconRef.current &&
        !settingsIconRef.current.contains(event.target)
      ) {
        setIsSettingsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close sidebar by default on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  const menuItems = [
    { name: "Guides", icon: Users, path: "guides" },
    { name: "Groups", icon: LayoutGrid, path: "groups" },
    { name: "Projects", icon: Briefcase, path: "projects" },
    { name: "Schedules", icon: Calendar, path: "schedules" },
    { name: "Divisions", icon: Building, path: "divisions" },
    { name: "Evaluation", icon: SlidersHorizontal, path: "evaluation" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-900 text-white font-sans">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-gray-800 transition-all duration-300 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-700 min-h-[53px]">
          <h1
            className={`font-bold text-lg text-cyan-400 transition-all ${
              !isSidebarOpen ? "hidden" : "block"
            }`}
          >
            Dashboard
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-300 hover:text-white"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(`/admin/dashboard/${item.path}`)}
              className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-cyan-600 transition"
            >
              <item.icon size={20} className="mr-3 flex-shrink-0" />
              {isSidebarOpen && <span>{item.name}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex justify-between items-center px-6 py-3 bg-gray-800 border-b border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold whitespace-nowrap">
            Admin Control Center
          </h2>
          <div className="relative">
            <Settings
              ref={settingsIconRef}
              size={24}
              className="cursor-pointer hover:text-cyan-400"
              onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
            />
            {isSettingsMenuOpen && (
              <div
                ref={settingsMenuRef}
                className="absolute right-0 mt-2 w-52 bg-gray-700 rounded-lg shadow-lg border border-gray-600"
              >
                <ul className="py-2">
                  {/* <li>
                    <button
                      className="flex items-center w-full px-4 py-2 hover:bg-gray-600"
                      onClick={() => navigate("/admin/settings")}
                    >
                      <User size={18} className="mr-2 flex-shrink-0" /> Profile
                    </button>
                  </li> */}
                  <li>
                    <button
                      className="flex items-center w-full px-4 py-2 hover:bg-gray-600"
                      onClick={() =>
                        navigate("/admin/dashboard/manage-password")
                      }
                    >
                      <Key size={18} className="mr-2 flex-shrink-0" /> Manage
                      Password
                    </button>
                  </li>
                  <li>
                    <button
                      className="flex items-center w-full px-4 py-2 hover:bg-gray-600"
                      onClick={handleLogout}
                    >
                      <LogOut size={18} className="mr-2 flex-shrink-0" /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="guides" element={<GuidesPage />} />
            <Route path="groups" element={<GroupsPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="schedules" element={<SchedulesPage />} />
            <Route path="divisions" element={<DivisionsPage />} />
            <Route path="evaluation" element={<EvaluationPage />} />
            <Route
              path="manage-password"
              element={<PasswordManager role="admin" />}
            />
            <Route
              index
              element={
                <div className="p-6 text-white">
                  📊 Welcome to the Admin Dashboard
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
