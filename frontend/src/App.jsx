import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import { NotificationProvider } from './context/notificationContext';
import ProtectedRoutes from './components/protectedRoutes';
import Login from './pages/loginPage';
import Feed from './pages/feedPage';
import AboutUs from './pages/aboutUs.jsx';
import ContactForm from './pages/contactUs.jsx';
import HowItWorks from './pages/howItWorks.jsx';
import TermsPage from './pages/termsPage.jsx';
import PrivacyPage from './pages/privacyPage.jsx';
import Register from './pages/registerPage';
import PreviewPage from './pages/previewPage.jsx';
import { Toaster } from 'react-hot-toast';
import ProfilePage from './pages/profilePage';
import OtherProfileView from './pages/OtherProfileView';
import AdminPage from './pages/adminPage.jsx'
import { UtilProvider } from './context/utilContext.jsx';
import CreatePostPage from './pages/createPost.jsx';
import "nprogress/nprogress.css";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <UtilProvider>  {/* Wrap at app level */}
          <BrowserRouter>
            <Toaster position="top-right" />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PreviewPage />} />
              <Route path="/preview" element={<PreviewPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/contact" element={<ContactForm />} />
              <Route path="/howitworks" element={<HowItWorks />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/ch3rryr3d" element={<AdminPage />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoutes />}>
                <Route path="/feed" element={<Feed />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/user/:er" element={<OtherProfileView />} />
                <Route path="/createPost" element={<CreatePostPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </UtilProvider>
      </NotificationProvider>
    </AuthProvider>);
}

export default App;
