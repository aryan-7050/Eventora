import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout & Landing
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Hero from './components/Hero/Hero';
import Features from './components/Features/Features';

// Student Portal
import StudentLogin from './pages/Auth/StudentLogin';
import StudentRegister from './pages/Auth/StudentRegister';
import StudentLayout from './pages/StudentDashboard/StudentLayout';
import StudentDashboard from './pages/StudentDashboard/StudentDashboard';
import StudentNotifications from './pages/StudentDashboard/StudentNotifications';
import BrowseEvents from './pages/BrowseEvents/BrowseEvents';
import RegisteredEvents from './pages/StudentDashboard/RegisteredEvents';
import AttendedEvents from './pages/StudentDashboard/AttendedEvents';
import StudentProfile from './pages/StudentDashboard/StudentProfile';
import {
} from './pages/StudentDashboard/Placeholders';

// Admin Portal
import AdminLogin from './pages/Admin/AdminLogin';
import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminCollegeCode from './pages/Admin/AdminCollegeCode';
import ApproveClubs from './pages/Admin/ApproveClubs';
import ApproveEvents from './pages/Admin/ApproveEvents';
import EventsConducted from './pages/Admin/EventsConducted';
import AdminNotifications from './pages/Admin/AdminNotifications';
import AdminStudents from './pages/Admin/AdminStudents';
import AdminClubs from './pages/Admin/AdminClubs';
import AdminAnnouncements from './pages/Admin/AdminAnnouncements';
import AdminProfile from './pages/Admin/AdminProfile';
import {
  AdminEvents,
} from './pages/Admin/AdminPlaceholders';
import ClubAnnouncements from './pages/Club/ClubAnnouncements';
import ClubBudget from './pages/Club/ClubBudget';

// Club Portal
import ClubLogin from './pages/Club/ClubLogin';
import ClubRegister from './pages/Club/ClubRegister';
import ClubLayout from './pages/Club/ClubLayout';
import ClubDashboard from './pages/Club/ClubDashboard';
import CreateEvent from './pages/Club/CreateEvent';
import EditEvent from './pages/Club/EditEvent';
import ClubEventStatus from './pages/Club/ClubEventStatus';
import ClubNotifications from './pages/Club/ClubNotifications';
import ClubApproveStudents from './pages/Club/ApproveStudents';
import ClubAttendance from './pages/Club/ClubAttendance';
import ManageEvents from './pages/Club/ManageEvents';
import ManageEditEvent from './pages/Club/ManageEditEvent';
import ClubFeedback from './pages/Club/ClubFeedback';
import ClubProfile from './pages/Club/ClubProfile';
import ClubCertificates from './pages/Club/ClubCertificates';
import ProtectedRoute from './components/ProtectedRoute';
import {
  ClubPostedEvents,
} from './pages/Club/ClubPlaceholders';

/* ── Wrappers ─────────────────────────────────────────────── */
const LandingPage = () => (
  <>
    <Navbar />
    <Hero />
    <Features />
    <Footer />
  </>
);

const AuthWrapper = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

/* ── App ──────────────────────────────────────────────────── */
function App() {
  return (
    <Router>
      <ToastContainer position="top-right" theme="colored" autoClose={3000} />
      <Routes>
        {/* Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Student Auth */}
        <Route path="/student/login" element={<AuthWrapper><StudentLogin /></AuthWrapper>} />
        <Route path="/student/register" element={<AuthWrapper><StudentRegister /></AuthWrapper>} />

        {/* Student Portal */}
        <Route path="/student" element={<ProtectedRoute><StudentLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="browse" element={<BrowseEvents />} />
          <Route path="registered" element={<RegisteredEvents />} />
          <Route path="attended" element={<AttendedEvents />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        {/* Admin Auth */}
        <Route path="/admin/login" element={<AuthWrapper><AdminLogin /></AuthWrapper>} />

        {/* Admin Portal */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="clubs" element={<AdminClubs />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="approve-clubs" element={<ApproveClubs />} />
          <Route path="approve-events" element={<ApproveEvents />} />
          <Route path="conducted-events" element={<EventsConducted />} />
          <Route path="college-code" element={<AdminCollegeCode />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* Club Auth */}
        <Route path="/club/login" element={<AuthWrapper><ClubLogin /></AuthWrapper>} />
        <Route path="/club/register" element={<AuthWrapper><ClubRegister /></AuthWrapper>} />

        {/* Club Portal */}
        <Route path="/club" element={<ProtectedRoute><ClubLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<ClubDashboard />} />
          <Route path="notifications" element={<ClubNotifications />} />
          <Route path="create-event" element={<CreateEvent />} />
          <Route path="edit-event/:id" element={<EditEvent />} />
          <Route path="posted-events" element={<ClubPostedEvents />} />
          <Route path="event-status" element={<ClubEventStatus />} />
          <Route path="approve-students" element={<ClubApproveStudents />} />
          <Route path="certificates" element={<ClubCertificates />} />
          <Route path="announcements" element={<ClubAnnouncements />} />
          <Route path="feedback" element={<ClubFeedback />} />
          <Route path="budget" element={<ClubBudget />} />
          <Route path="attendance" element={<ClubAttendance />} />
          <Route path="manage-events" element={<ManageEvents />} />
          <Route path="manage-edit/:id" element={<ManageEditEvent />} />
          <Route path="profile" element={<ClubProfile />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
