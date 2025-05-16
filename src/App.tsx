import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, Navigate } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";
import ResumeEditorPage from "./pages/ResumeEditorPage";
import TemplatesPage from "./pages/TemplatesPage";
import AdminPage from "./pages/AdminPage";
import DashboardPage from "./pages/DashboardPage"; 
import { Toaster } from "sonner";
import UserLoginPage from "./pages/UserLoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import UserSignup from "./pages/UserSignup";
import ProtectedRoute from "./components/ProtectedRoute";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<HomePage />} />
      
      {/* Protected Routes */}
      <Route path="dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="editor/:resumeId?" element={
        <ProtectedRoute>
          <ResumeEditorPage />
        </ProtectedRoute>
      } />
      <Route path="templates" element={
        <ProtectedRoute>
          <TemplatesPage />
        </ProtectedRoute>
      } />
      <Route path="admin" element={
        <ProtectedRoute requireAdmin>
          <AdminPage />
        </ProtectedRoute>
      } />

      {/* Auth Routes */}
      <Route path="admin-login" element={
        <ProtectedRoute requireAuth={false}>
          <AdminLoginPage />
        </ProtectedRoute>
      } />
      <Route path="user-login" element={
        <ProtectedRoute requireAuth={false}>
          <UserLoginPage />
        </ProtectedRoute>
      } />
      <Route path="user-signup" element={
        <ProtectedRoute requireAuth={false}>
          <UserSignup />
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
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
