import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
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
  component: WorkerRegistration,
});

const workerProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/worker/profile',
  component: WorkerProfile,
});

const workerJobsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/worker/jobs',
  component: JobDiscovery,
});

const workerHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/worker/history',
  component: WorkHistory,
});

const workerWalletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/worker/wallet',
  component: WorkerWallet,
});

const workerAvailabilityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/worker/availability',
  component: WorkerAvailability,
});

const workerNotificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/worker/notifications',
  component: WorkerNotifications,
});

const employerRegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/register',
  component: EmployerRegistration,
});

const employerProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/profile',
  component: EmployerProfile,
});

const employerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/dashboard',
  component: EmployerDashboard,
});

const employerAnalyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/analytics',
  component: EmployerAnalytics,
});

const employerSubscriptionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/subscription',
  component: SubscriptionTiers,
});

const createJobRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/jobs/create',
  component: CreateJobPosting,
});

const employerJobsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/jobs',
  component: EmployerJobList,
});

const bulkJobUploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/bulk-upload',
  component: BulkJobUpload,
});

const attendanceScannerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/attendance',
  component: AttendanceScanner,
});

const jobCandidatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/job/$jobId/candidates',
  component: JobCandidates,
});

const employerFavoritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/favorites',
  component: EmployerFavorites,
});

const jobTemplatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/templates',
  component: JobTemplates,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/dashboard',
  component: AdminDashboard,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  roleSelectRoute,
  workerRegisterRoute,
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
