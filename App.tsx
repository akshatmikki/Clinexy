import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import ScrollToHash from './components/ScrollToHash';
import { SolutionsSoloDoctors } from './pages/SolutionsSoloDoctors';
import { FeaturesDoctorBranding } from './pages/FeaturesDoctorBranding';
import { FeaturesAppointmentsReminders } from './pages/FeaturesAppointmentsReminders';
import { FeaturesTeleconsultation } from './pages/FeaturesTeleconsultation';
import { FeaturesPatientManagement } from './pages/FeaturesPatientManagement';
import { FeaturesDoctorWebsite } from './pages/FeaturesDoctorWebsite';
import { FeaturesReviewsReputation } from './pages/FeaturesReviewsReputation';
import { PricingSoloDoctors } from './pages/PricingSoloDoctors';
import { CompareMocDoc } from './pages/CompareMocDoc';
import { ComparePracto } from './pages/ComparePracto';
import { CompareSimplePractice } from './pages/CompareSimplePractice';
import { CompareCliniko } from './pages/CompareCliniko';
import { PageTemplate } from './pages/PageTemplate';
import { SITEMAP } from './constants';
import { BlogDetails } from './pages/BlogDetails';
import CreateBlog from "./pages/CreateBlog";
import Blogs from "./pages/Blogs";


const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <ScrollToHash />
      <div className="font-sans text-slate-900 bg-white">
        <Header />
        <main>
          <Routes>
            {/* Explicit Home Route */}
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:slug" element={<BlogDetails />} />
            <Route path="/create-blog" element={<CreateBlog />} />
            {/* Specific Page Routes */}
            <Route path="/solutions/solo-doctors" element={<SolutionsSoloDoctors />} />
            <Route path="/features/doctor-branding-growth" element={<FeaturesDoctorBranding />} />
            <Route path="/features/appointments-reminders" element={<FeaturesAppointmentsReminders />} />
            <Route path="/features/teleconsultation-prescriptions" element={<FeaturesTeleconsultation />} />
            <Route path="/features/patient-management" element={<FeaturesPatientManagement />} />
            <Route path="/features/doctor-website" element={<FeaturesDoctorWebsite />} />
            <Route path="/features/reviews-reputation" element={<FeaturesReviewsReputation />} />
            <Route path="/pricing/solo-doctors" element={<PricingSoloDoctors />} />
            <Route path="/compare/clinexy-vs-mocdoc" element={<CompareMocDoc />} />
            <Route path="/compare/clinexy-vs-practo" element={<ComparePracto />} />
            <Route path="/compare/clinexy-vs-simplepractice" element={<CompareSimplePractice />} />
            <Route path="/compare/clinexy-vs-cliniko" element={<CompareCliniko />} />


            {/* Dynamic Routes from Sitemap for all other pages */}
            {SITEMAP.map((page) => {
              // Filter out pages that already have explicit components above
              if (
                page.path === '/' ||
                page.path === '/solutions/solo-doctors' ||
                page.path === '/features/doctor-branding-growth' ||
                page.path === '/features/appointments-reminders' ||
                page.path === '/features/teleconsultation-prescriptions' ||
                page.path === '/features/patient-management' ||
                page.path === '/features/doctor-website' ||
                page.path === '/features/reviews-reputation' ||
                page.path === '/pricing/solo-doctors' ||
                page.path === '/compare/clinexy-vs-mocdoc' ||
                page.path === '/compare/clinexy-vs-practo' ||
                page.path === '/compare/clinexy-vs-simplepractice' ||
                page.path === '/compare/clinexy-vs-cliniko'
              ) return null;

              return (
                <Route
                  key={page.path}
                  path={page.path}
                  element={<PageTemplate data={page} />}
                />
              );
            })}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;