import { createBrowserRouter } from "react-router-dom";
import { AuthGuard } from "./components/AuthGuard";
import { AuthForms } from "./components/AuthForms";
import HomePage from "./pages/HomePage";
import ClinicsPage from "./pages/ClinicsPage";
import ClinicDetailPage from "./pages/ClinicDetailPage";
import FreelancersPage from "./pages/FreelancersPage";
import FreelancerDetailPage from "./pages/FreelancerDetailPage";
import ProfilePage from "./pages/ProfilePage";
import AppointmentsPage from "./pages/AppointmentsPage";
import AppointmentBookingPage from "./pages/AppointmentBookingPage";
import PetRegistrationPage from "./pages/PetRegistrationPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: (
      <AuthGuard requireAuth={false} redirectIfAuthenticated>
        <AuthForms />
      </AuthGuard>
    ),
  },
  {
    path: "/register",
    element: (
      <AuthGuard requireAuth={false} redirectIfAuthenticated>
        <AuthForms />
      </AuthGuard>
    ),
  },
  {
    path: "/clinics",
    element: <ClinicsPage />,
  },
  {
    path: "/clinics/:id",
    element: <ClinicDetailPage />,
  },
  {
    path: "/freelancers",
    element: <FreelancersPage />,
  },
  {
    path: "/freelancers/:id",
    element: <FreelancerDetailPage />,
  },
  {
    path: "/appointments",
    element: (
      <AuthGuard>
        <AppointmentsPage />
      </AuthGuard>
    ),
  },
  {
    path: "/book/:providerType/:providerId",
    element: (
      <AuthGuard>
        <AppointmentBookingPage />
      </AuthGuard>
    ),
  },
  {
    path: "/profile",
    element: (
      <AuthGuard>
        <ProfilePage />
      </AuthGuard>
    ),
  },
  {
    path: "/pets",
    element: (
      <AuthGuard>
        <PetRegistrationPage />
      </AuthGuard>
    ),
  },
]);

export default router;
