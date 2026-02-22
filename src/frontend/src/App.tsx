import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import UserRoleSelector from './components/UserRoleSelector';
import WorkerRegistration from './pages/WorkerRegistration';
import WorkerProfile from './pages/WorkerProfile';
import EmployerRegistration from './pages/EmployerRegistration';
import EmployerProfile from './pages/EmployerProfile';
import CreateJobPosting from './pages/CreateJobPosting';
import EmployerJobList from './pages/EmployerJobList';
import JobDiscovery from './pages/JobDiscovery';
import AttendanceScanner from './pages/AttendanceScanner';
import WorkHistory from './pages/WorkHistory';
import WorkerWallet from './pages/WorkerWallet';
import WorkerDashboard from './pages/WorkerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import EmployerAnalytics from './pages/EmployerAnalytics';
import AdminDashboard from './pages/AdminDashboard';
import SubscriptionTiers from './pages/SubscriptionTiers';
import BulkJobUpload from './pages/BulkJobUpload';
import JobCandidates from './pages/JobCandidates';
import EmployerFavorites from './pages/EmployerFavorites';
import JobTemplates from './pages/JobTemplates';
import WorkerAvailability from './pages/WorkerAvailability';
import WorkerNotifications from './pages/WorkerNotifications';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  useEffect(() => {
    if (!isInitializing && !identity) {
      navigate({ to: '/' });
    } else if (identity && isFetched && !userProfile) {
      navigate({ to: '/select-role' });
    }
  }, [identity, isInitializing, userProfile, isFetched, navigate]);

  if (isInitializing || profileLoading || !isFetched) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity || !userProfile) {
    return null;
  }

  return <>{children}</>;
}

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const roleSelectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/select-role',
  component: UserRoleSelector,
});

const workerRegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/worker/register',
  component: () => (
    <ProtectedRoute>
      <WorkerRegistration />
    </ProtectedRoute>
  ),
});

const workerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/worker/dashboard',
  component: () => (
    <ProtectedRoute>
      <WorkerDashboard />
    </ProtectedRoute>
  ),
});

const workerProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/worker/profile',
  component: () => (
    <ProtectedRoute>
      <WorkerProfile />
    </ProtectedRoute>
  ),
});

const workerJobsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/worker/jobs',
  component: () => (
    <ProtectedRoute>
      <JobDiscovery />
    </ProtectedRoute>
  ),
});

const workerHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/worker/history',
  component: () => (
    <ProtectedRoute>
      <WorkHistory />
    </ProtectedRoute>
  ),
});

const workerWalletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/worker/wallet',
  component: () => (
    <ProtectedRoute>
      <WorkerWallet />
    </ProtectedRoute>
  ),
});

const workerAvailabilityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/worker/availability',
  component: () => (
    <ProtectedRoute>
      <WorkerAvailability />
    </ProtectedRoute>
  ),
});

const workerNotificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/worker/notifications',
  component: () => (
    <ProtectedRoute>
      <WorkerNotifications />
    </ProtectedRoute>
  ),
});

const employerRegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/register',
  component: () => (
    <ProtectedRoute>
      <EmployerRegistration />
    </ProtectedRoute>
  ),
});

const employerProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/profile',
  component: () => (
    <ProtectedRoute>
      <EmployerProfile />
    </ProtectedRoute>
  ),
});

const employerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/dashboard',
  component: () => (
    <ProtectedRoute>
      <EmployerDashboard />
    </ProtectedRoute>
  ),
});

const employerAnalyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/analytics',
  component: () => (
    <ProtectedRoute>
      <EmployerAnalytics />
    </ProtectedRoute>
  ),
});

const employerSubscriptionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/subscription',
  component: () => (
    <ProtectedRoute>
      <SubscriptionTiers />
    </ProtectedRoute>
  ),
});

const createJobRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/jobs/create',
  component: () => (
    <ProtectedRoute>
      <CreateJobPosting />
    </ProtectedRoute>
  ),
});

const employerJobsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/jobs',
  component: () => (
    <ProtectedRoute>
      <EmployerJobList />
    </ProtectedRoute>
  ),
});

const bulkJobUploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/bulk-upload',
  component: () => (
    <ProtectedRoute>
      <BulkJobUpload />
    </ProtectedRoute>
  ),
});

const attendanceScannerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/attendance',
  component: () => (
    <ProtectedRoute>
      <AttendanceScanner />
    </ProtectedRoute>
  ),
});

const jobCandidatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/job/$jobId/candidates',
  component: () => (
    <ProtectedRoute>
      <JobCandidates />
    </ProtectedRoute>
  ),
});

const employerFavoritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/favorites',
  component: () => (
    <ProtectedRoute>
      <EmployerFavorites />
    </ProtectedRoute>
  ),
});

const jobTemplatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/templates',
  component: () => (
    <ProtectedRoute>
      <JobTemplates />
    </ProtectedRoute>
  ),
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/dashboard',
  component: () => (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  roleSelectRoute,
  workerRegisterRoute,
  workerDashboardRoute,
  workerProfileRoute,
  workerJobsRoute,
  workerHistoryRoute,
  workerWalletRoute,
  workerAvailabilityRoute,
  workerNotificationsRoute,
  employerRegisterRoute,
  employerProfileRoute,
  employerDashboardRoute,
  employerAnalyticsRoute,
  employerSubscriptionRoute,
  createJobRoute,
  employerJobsRoute,
  bulkJobUploadRoute,
  attendanceScannerRoute,
  jobCandidatesRoute,
  employerFavoritesRoute,
  jobTemplatesRoute,
  adminDashboardRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
