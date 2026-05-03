import { Routes, Route } from 'react-router-dom';
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
import './App.css';

function App() {
  return (
    <div className="app-shell">
      <BackgroundAnimation />
      <Cursor />
      <ScrollRevealManager />
      <Navbar />
      <SectionNav />
      <BackToTop />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/student-work" element={<StudentWork />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
