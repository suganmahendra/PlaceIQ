import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LandingPage } from './pages/public/LandingPage';
import { StudentRegister } from './pages/auth/StudentRegister';
import { StudentLogin } from './pages/auth/StudentLogin';
import { RegisterSelection } from './pages/auth/RegisterSelection';
import { MentorRegister } from './pages/auth/MentorRegister';
import { DashboardHome } from './pages/student/DashboardHome';
import { AboutPage } from './pages/public/AboutPage';
import { LearningPage } from './pages/public/LearningPage';
import { ContactPage } from './pages/public/ContactPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterSelection />} />
          <Route path="/register-student" element={<StudentRegister />} />
          <Route path="/login" element={<StudentLogin />} />
          <Route path="/register-mentor" element={<MentorRegister />} />

          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<div className="container mx-auto py-20 px-4">Features Page (Coming Soon)</div>} />
          <Route path="/learning-preview" element={<LearningPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Auth Layout for Dashboard */}
        <Route path="/student" element={<DashboardLayout />}>
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="learning" element={<div className="p-10 text-center text-gray-500">Learning Paths Page</div>} />
          <Route path="quiz" element={<div className="p-10 text-center text-gray-500">Quiz Page</div>} />
          <Route path="analytics" element={<div className="p-10 text-center text-gray-500">Analytics Page</div>} />
          <Route path="ai-chat" element={<div className="p-10 text-center text-gray-500">AI Chatbot Page</div>} />
          <Route path="placements" element={<div className="p-10 text-center text-gray-500">Placements Page</div>} />
          <Route path="profile" element={<div className="p-10 text-center text-gray-500">Profile Page</div>} />
        </Route>

        <Route path="/mentor" element={<DashboardLayout />}>
          <Route path="dashboard" element={<div className="p-10 text-center text-gray-500">Mentor Dashboard (Coming Soon)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
