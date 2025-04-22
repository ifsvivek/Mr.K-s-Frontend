import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";
import ResumeEditorPage from "./pages/ResumeEditorPage";
import TemplatesPage from "./pages/TemplatesPage";
import AdminPage from "./pages/AdminPage";
import DashboardPage from "./pages/DashboardPage"; // Added DashboardPage import
import { Toaster } from "sonner";
import UserLoginPage from "./pages/UserLoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<HomePage />} />
      <Route path="dashboard" element={<DashboardPage />} /> {/* Added dashboard route */}
      <Route path="editor/:resumeId?" element={<ResumeEditorPage />} />
      <Route path="templates" element={<TemplatesPage />} />
      <Route path="admin" element={<AdminPage />} />
      <Route path="admin-login" element={<AdminLoginPage />} />
      <Route path="user-login" element={<UserLoginPage />} />

    </Route>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" closeButton />
    </>
  );
}

export default App;
