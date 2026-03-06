import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthGuard } from './components/auth/AuthGuard';
import { ScrollToTop } from './components/layout/ScrollToTop';
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
import { AnnouncementsPage } from './pages/student/AnnouncementsPage';
import { CourseDetailPage } from './pages/student/CourseDetailPage';
import { LessonPage } from './pages/student/LessonPage';
import { RoadmapPage } from './pages/public/RoadmapPage';
import { DashboardHome as MentorDashboard } from './pages/mentor/DashboardHome';
import { CMSDashboard } from './pages/mentor/cms/CMSDashboard';
import { RoadmapEditor } from './pages/mentor/cms/RoadmapEditor';
import { PhaseManager } from './pages/mentor/cms/PhaseManager';
import { QuizPage } from './pages/student/QuizPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <ScrollToTop />
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

            {/* Protected Student Routes (with Dashboard Layout) */}
            <Route path="/student" element={
              <AuthGuard allowedRoles={['student']} >
                <DashboardLayout />
              </AuthGuard>
            }>
              <Route path="dashboard" element={<DashboardHome />} />
              <Route path="coding" element={<CodingHomePage />} />
              <Route path="coding/python" element={<PythonCodingPage />} />
              <Route path="coding/java" element={<JavaCodingPage />} />
              <Route path="courses" element={<CoursesHomePage />} />
              <Route path="courses/:slug" element={<CourseDetailPage />} />
              <Route path="learning" element={<LearningPathPage />} />
              <Route path="quiz" element={<QuizPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="ai-chat" element={<AIChatbotPage />} />
              <Route path="placements" element={<PlacementsPage />} />
              <Route path="announcements" element={<AnnouncementsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Standalone Fullscreen Student Routes */}
            <Route path="/student/courses/:courseSlug/:lessonSlug" element={
              <AuthGuard allowedRoles={['student']} >
                <LessonPage />
              </AuthGuard>
            } />

            {/* Protected Mentor Routes */}
            < Route path="/mentor" element={
              < AuthGuard allowedRoles={['mentor']} >
                <DashboardLayout />
              </AuthGuard >
            }>
              <Route path="dashboard" element={<MentorDashboard />} />
              <Route path="cms" element={<CMSDashboard />} />
              <Route path="cms/new" element={<RoadmapEditor />} />
              <Route path="cms/roadmap/:id" element={<RoadmapEditor />} />
              <Route path="cms/phases/:moduleId" element={<PhaseManager />} />
            </Route >
          </Routes >
        </NotificationProvider>
      </AuthProvider >
    </BrowserRouter >
  );
}

export default App;
