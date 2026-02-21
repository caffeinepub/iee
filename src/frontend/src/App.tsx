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

const attendanceScannerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/attendance',
  component: AttendanceScanner,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  roleSelectRoute,
  workerRegisterRoute,
  workerProfileRoute,
  workerJobsRoute,
  workerHistoryRoute,
  workerWalletRoute,
  employerRegisterRoute,
  employerProfileRoute,
  employerDashboardRoute,
  createJobRoute,
  employerJobsRoute,
  attendanceScannerRoute,
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
