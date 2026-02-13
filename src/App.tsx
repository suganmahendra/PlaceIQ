import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AuthGuard } from './components/auth/AuthGuard';
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LandingPage } from './pages/public/LandingPage';
import { StudentRegister } from './pages/auth/StudentRegister';
import { StudentLogin } from './pages/auth/StudentLogin';
import { MentorLogin } from './pages/auth/MentorLogin';
import { RegisterSelection } from './pages/auth/RegisterSelection';
import { MentorRegister } from './pages/auth/MentorRegister';
import { CompleteProfile } from './pages/auth/CompleteProfile';
import { AuthCallback } from './pages/auth/AuthCallback';
import { ResetPassword } from './pages/auth/ResetPassword';
import { DashboardHome } from './pages/student/DashboardHome';
import { AboutPage } from './pages/public/AboutPage';
import { LearningPage } from './pages/public/LearningPage';
import { ContactPage } from './pages/public/ContactPage';
import { LearningPathPage } from './pages/student/LearningPathPage';
import { CodingHomePage } from './pages/student/CodingHomePage';
import { PythonCodingPage } from './pages/student/PythonCodingPage';
import { JavaCodingPage } from './pages/student/JavaCodingPage';
import { CoursesHomePage } from './pages/student/CoursesHomePage';
import { AnalyticsPage } from './pages/student/AnalyticsPage';
import { PlacementsPage } from './pages/student/PlacementsPage';
import { AIChatbotPage } from './pages/student/AIChatbotPage';
import { ProfilePage } from './pages/student/ProfilePage';
import { CourseDetailPage } from './pages/student/CourseDetailPage';
import { RoadmapPage } from './pages/public/RoadmapPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterSelection />} />
            <Route path="/register-student" element={<StudentRegister />} />
            <Route path="/login" element={<StudentLogin />} />
            <Route path="/login-mentor" element={<MentorLogin />} />
            <Route path="/register-mentor" element={<MentorRegister />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/auth/update-password" element={<ResetPassword />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/features" element={<div className="container mx-auto py-20 px-4">Features Page (Coming Soon)</div>} />
            <Route path="/learning-preview" element={<LearningPage />} />
            <Route path="/roadmap/:roadmapId" element={<RoadmapPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route >

          {/* Protected Student Routes */}
          < Route path="/student" element={
            < AuthGuard allowedRoles={['student']} >
              <DashboardLayout />
            </AuthGuard >
          }>
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="coding" element={<CodingHomePage />} />
            <Route path="coding/python" element={<PythonCodingPage />} />
            <Route path="coding/java" element={<JavaCodingPage />} />
            <Route path="courses" element={<CoursesHomePage />} />
            <Route path="courses/:slug" element={<CourseDetailPage />} />
            <Route path="learning" element={<LearningPathPage />} />
            <Route path="quiz" element={<div className="p-10 text-center text-gray-500">Quiz Page</div>} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="ai-chat" element={<AIChatbotPage />} />
            <Route path="placements" element={<PlacementsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route >

          {/* Protected Mentor Routes */}
          < Route path="/mentor" element={
            < AuthGuard allowedRoles={['mentor']} >
              <DashboardLayout />
            </AuthGuard >
          }>
            <Route path="dashboard" element={<div className="p-10 text-center text-gray-500">Mentor Dashboard (Coming Soon)</div>} />
          </Route >
        </Routes >
      </BrowserRouter >
    </AuthProvider >
  );
}

export default App;
