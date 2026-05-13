import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import BackToTop from './components/BackToTop.jsx';
import SectionNav from './components/SectionNav.jsx';
import Cursor from './components/Cursor.jsx';
import ScrollRevealManager from './components/ScrollRevealManager.jsx';
import BackgroundAnimation from './components/BackgroundAnimation.jsx';
import Home from './pages/Home.jsx';
import Courses from './pages/Courses.jsx';
import CourseDetails from './pages/CourseDetails.jsx';
import Booking from './pages/Booking.jsx';
import RoadmapPage from './pages/Roadmap.jsx';
import StudentWork from './pages/StudentWork.jsx';
import Dashboard from './pages/Dashboard.jsx';
import MyCourses from './pages/MyCourses.jsx';
import Projects from './pages/Projects.jsx';
import Progress from './pages/Progress.jsx';
import Tasks from './pages/Tasks.jsx';
import Rewards from './pages/Rewards.jsx';
import AdminTasks from './pages/AdminTasks.jsx';
import './App.css';

function App() {
  const location = useLocation();
  const appRoutes = ['/dashboard', '/my-courses', '/projects', '/progress', '/tasks', '/rewards', '/admin/tasks'];
  const isAppRoute = appRoutes.includes(location.pathname);

  return (
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/admin/tasks" element={<AdminTasks />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
