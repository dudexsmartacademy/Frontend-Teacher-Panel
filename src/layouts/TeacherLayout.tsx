import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function TeacherLayout() {
  return (
    <div className="flex min-h-screen w-full min-w-0 max-w-full overflow-x-clip">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Portal Container */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="min-h-0 min-w-0 w-full max-w-full flex-1 overflow-x-clip">
          <Outlet />
        </main>
      </div>
    </div>
  );
}