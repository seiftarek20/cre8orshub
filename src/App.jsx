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
import Home from './pages/Home.jsx';
import Courses from './pages/Courses.jsx';
import CourseDetails from './pages/CourseDetails.jsx';
import Booking from './pages/Booking.jsx';
import RoadmapPage from './pages/Roadmap.jsx';
import StudentWork from './pages/StudentWork.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Profile from './pages/Profile.jsx';
import Dashboard from './pages/Dashboard.jsx';
import MyCourses from './pages/MyCourses.jsx';
import Projects from './pages/Projects.jsx';
import Progress from './pages/Progress.jsx';
import Tasks from './pages/Tasks.jsx';
import Rewards from './pages/Rewards.jsx';
import AdminTasks from './pages/AdminTasks.jsx';
import Submissions from './pages/Submissions.jsx';
import AdminSubmissions from './pages/AdminSubmissions.jsx';
import AdminBookings from './pages/AdminBookings.jsx';
import './App.css';

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
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
