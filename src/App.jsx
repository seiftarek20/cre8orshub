import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import BackToTop from './components/BackToTop.jsx';
import SectionNav from './components/SectionNav.jsx';
import Cursor from './components/Cursor.jsx';
import ScrollRevealManager from './components/ScrollRevealManager.jsx';
import BackgroundAnimation from './components/BackgroundAnimation.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import RoleRoute from './components/RoleRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './App.css';

const Home = lazy(() => import('./pages/Home.jsx'));
const Courses = lazy(() => import('./pages/Courses.jsx'));
const CourseDetails = lazy(() => import('./pages/CourseDetails.jsx'));
const Booking = lazy(() => import('./pages/Booking.jsx'));
const RoadmapPage = lazy(() => import('./pages/Roadmap.jsx'));
const StudentWork = lazy(() => import('./pages/StudentWork.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Signup = lazy(() => import('./pages/Signup.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const MyCourses = lazy(() => import('./pages/MyCourses.jsx'));
const Projects = lazy(() => import('./pages/Projects.jsx'));
const Progress = lazy(() => import('./pages/Progress.jsx'));
const Tasks = lazy(() => import('./pages/Tasks.jsx'));
const Rewards = lazy(() => import('./pages/Rewards.jsx'));
const AdminTasks = lazy(() => import('./pages/AdminTasks.jsx'));
const Submissions = lazy(() => import('./pages/Submissions.jsx'));
const AdminSubmissions = lazy(() => import('./pages/AdminSubmissions.jsx'));
const AdminBookings = lazy(() => import('./pages/AdminBookings.jsx'));
const AdminProjects = lazy(() => import('./pages/AdminProjects.jsx'));
const AdminAnalytics = lazy(() => import('./pages/AdminAnalytics.jsx'));

function App() {
  const location = useLocation();
  const appRoutes = [
    '/dashboard',
    '/my-courses',
    '/projects',
    '/progress',
    '/tasks',
    '/submissions',
    '/rewards',
    '/profile',
    '/admin/tasks',
    '/admin/submissions',
    '/admin/bookings',
    '/admin/projects',
    '/admin/analytics',
  ];
  const isAppRoute = appRoutes.includes(location.pathname);

  return (
    <AuthProvider>
      <div className="app-shell">
        <BackgroundAnimation />
        <Cursor />
        <ScrollRevealManager />
        <Navbar />
        {!isAppRoute ? <SectionNav /> : null}
        <BackToTop />
        <main>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetails />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/student-work" element={<StudentWork />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
              <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
              <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
              <Route path="/submissions" element={<ProtectedRoute><Submissions /></ProtectedRoute>} />
              <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route
                path="/admin/tasks"
                element={<RoleRoute allowedRoles={['admin', 'instructor']}><AdminTasks /></RoleRoute>}
              />
              <Route
                path="/admin/submissions"
                element={<RoleRoute allowedRoles={['admin', 'instructor']}><AdminSubmissions /></RoleRoute>}
              />
              <Route
                path="/admin/bookings"
                element={<RoleRoute allowedRoles={['admin', 'instructor']}><AdminBookings /></RoleRoute>}
              />
              <Route
                path="/admin/projects"
                element={<RoleRoute allowedRoles={['admin', 'instructor']}><AdminProjects /></RoleRoute>}
              />
              <Route
                path="/admin/analytics"
                element={<RoleRoute allowedRoles={['admin', 'instructor']}><AdminAnalytics /></RoleRoute>}
              />
            </Routes>
          </Suspense>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
