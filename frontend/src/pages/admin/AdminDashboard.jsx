import { useState, useRef, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import {
  Users,
  Briefcase,
  Calendar,
  Building,
  SlidersHorizontal,
  Settings,
  LogOut,
  Key,
  LayoutGrid,
} from "lucide-react";

// Import your page components
import PasswordManager from "../../components/PasswordManager";
import GuideManagement from "./GuideManagement";

// Dummy page components (replace with real ones later)
const GroupsPage = () => (
  <div className="p-6 text-white">
    <h2 className="text-3xl font-bold mb-4">👥 Manage Groups</h2>
    <p>
      This is the page for managing student groups. You can add, edit, or remove
      groups here.
    </p>
  </div>
);
const ProjectsPage = () => (
  <div className="p-6 text-white">
    <h2 className="text-3xl font-bold mb-4">💼 Manage Projects</h2>
    <p>This is the page for overseeing project assignments and submissions.</p>
  </div>
);
const SchedulesPage = () => (
  <div className="p-6 text-white">
    <h2 className="text-3xl font-bold mb-4">🗓️ Exam Schedules</h2>
    <p>This is the page for creating and managing exam schedules.</p>
  </div>
);
const DivisionsPage = () => (
  <div className="p-6 text-white">
    <h2 className="text-3xl font-bold mb-4">🏫 Manage Divisions</h2>
    <p>
      This is the page for managing college divisions and student enrollments.
    </p>
  </div>
);
const EvaluationPage = () => (
  <div className="p-6 text-white">
    <h2 className="text-3xl font-bold mb-4">📊 Evaluation Parameters</h2>
    <p>This is the page for defining project evaluation criteria.</p>
  </div>
);

// New Home component with dashboard cards
function Home({ menuItems, navigate }) {
  // Helper component for a dashboard card
  const DashboardCard = ({
    // eslint-disable-next-line no-unused-vars
    icon: Icon,
    title,
    description,
    onClick,
    index,
  }) => (
    <div
      className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/30 hover:scale-[1.02] transition-all duration-300 flex flex-col items-center text-center animate-fade-in-up"
      style={{ animationDelay: `${index * 0.15}s` }}
      aria-label={`Maps to ${title}`}
    >
      <Icon
        size={56}
        className="text-cyan-400 mb-3 drop-shadow-md animate-icon-pulse"
      />
      <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
      {description && (
        <p className="text-sm text-white/90 mb-3 flex-grow">{description}</p>
      )}
      <button
        onClick={onClick}
        className="flex items-center bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-1.5 px-4 rounded-lg text-sm font-semibold hover:bg-opacity-90 hover:scale-105 transition duration-200 shadow-lg border border-white/20 backdrop-blur-sm animate-pulse-once"
        aria-label={`Go to ${title.replace("Manage ", "").replace("s", "")}`}
      >
        {`Go to ${title.replace("Manage ", "").replace("s", "")}`}
      </button>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto mt-4 px-4 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((card, index) => (
          <DashboardCard
            key={card.title}
            icon={card.icon}
            title={card.title}
            description={card.description}
            onClick={() => navigate(`/admin/dashboard/${card.path}`)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

// Main Dashboard component
function Dashboard() {
  const navigate = useNavigate();
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  const menuItems = [
    {
      name: "Guides",
      icon: Users,
      path: "guides",
      title: "Manage Guides",
      description:
        "View, add, edit, and manage guide profiles and assignments.",
    },
    {
      name: "Groups",
      icon: LayoutGrid,
      path: "groups",
      title: "Manage Groups",
      description:
        "Organize and oversee student project groups and memberships.",
    },
    {
      name: "Projects",
      icon: Briefcase,
      path: "projects",
      title: "Manage Projects",
      description: "Oversee project assignments, progress, and submissions.",
    },
    {
      name: "Schedules",
      icon: Calendar,
      path: "schedules",
      title: "Exam Schedules",
      description: "Create, update, and manage project and seminar schedules.",
    },
    {
      name: "Divisions",
      icon: Building,
      path: "divisions",
      title: "Manage Divisions",
      description: "Add and manage college divisions and student enrollments.",
    },
    {
      name: "Evaluation",
      icon: SlidersHorizontal,
      path: "evaluation",
      title: "Evaluation Parameters",
      description:
        "Define and update project evaluation criteria and percentages.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white font-sans">
      <style>
        {`
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse-once {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          @keyframes icon-pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out;
          }
          .animate-pulse-once {
            animation: pulse-once 0.5s ease-in-out;
          }
          .animate-icon-pulse {
            animation: icon-pulse 2s infinite ease-in-out;
          }
          .bg-particles {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 800'%3E%3Ccircle fill='%2300b8d4' cx='100' cy='100' r='5'/%3E%3Ccircle fill='%2300b8d4' cx='700' cy='200' r='4'/%3E%3Ccircle fill='%2300b8d4' cx='300' cy='600' r='6'/%3E%3Ccircle fill='%2300b8d4' cx='500' cy='400' r='5'/%3E%3C/svg%3E") repeat;
            opacity: 0.1;
          }
        `}
      </style>
      <div className="bg-particles" />

      {/* Topbar */}
      <header className="w-full bg-white/10 backdrop-blur-sm border-b border-white/30 shadow-lg z-10 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-lg">
            Admin <span className="text-cyan-400">Control Center</span>
          </h1>
          <div className="relative">
            <Settings
              ref={settingsIconRef}
              size={30}
              className={`text-white hover:text-cyan-400 transition duration-200 cursor-pointer drop-shadow-md ${
                isSettingsMenuOpen ? "animate-spin" : ""
              }`}
              onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
              title="System Settings"
              aria-label="Toggle settings menu"
            />
            {isSettingsMenuOpen && (
              <div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex justify-end p-4 sm:p-6"
                onClick={() => setIsSettingsMenuOpen(false)} // This handler closes the menu when the background is clicked
              >
                <div
                  ref={settingsMenuRef}
                  className="bg-white/20 backdrop-blur-xl rounded-xl shadow-lg border border-white/30 overflow-hidden animate-fade-in transform scale-100 transition duration-200"
                  onClick={(e) => e.stopPropagation()} // This prevents clicks on the menu from bubbling up and closing it
                >
                  <ul className="py-2">
                    <li>
                      <button
                        onClick={() => {
                          navigate("/admin/dashboard/manage-password");
                          setIsSettingsMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-white hover:bg-cyan-400/30 transition duration-150"
                        aria-label="Change Password"
                      >
                        <Key size={20} className="mr-3 text-white" /> Change
                        Password
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-white hover:bg-cyan-400/30 transition duration-150"
                        aria-label="Logout"
                      >
                        <LogOut size={20} className="mr-3 text-white" /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <Routes>
          <Route
            index
            element={<Home menuItems={menuItems} navigate={navigate} />}
          />
          <Route path="guides" element={<GuideManagement />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="schedules" element={<SchedulesPage />} />
          <Route path="divisions" element={<DivisionsPage />} />
          <Route path="evaluation" element={<EvaluationPage />} />
          <Route
            path="manage-password"
            element={<PasswordManager role="admin" />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default Dashboard;
