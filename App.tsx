import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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
import CalculatorPage from './pages/Calculatorpage';
import { ComparePracto } from './pages/ComparePracto';
import { CompareSimplePractice } from './pages/CompareSimplePractice';
import { CompareCliniko } from './pages/CompareCliniko';
import { PageTemplate } from './pages/PageTemplate';
import { SITEMAP } from './constants';
import { BlogDetails } from './pages/BlogDetails';
import Blogs from "./pages/Blogs";
import AdminBlogs from "./pages/AdminBlogs";
import AdminLogin from "./pages/AdminLogin";
import PractoVsClinexyCalculator from './pages/ClinexyPractoCalculator';
import ValueCostCalculator from './pages/ValueAndCostCalculator';
import ClinikoCalculator from './pages/ClinikoCalculator';
import MocDocCalculator from './pages/MocDocCalculator';

const ADMIN_AUTH_KEY = "clinexy_admin_auth";

type RouteMetaInfo = {
  title: string;
  description: string;
  keywords: string;
};

const ROUTE_META: Record<string, RouteMetaInfo> = {
  '/': {
    title: 'Digital Clinic Software for Solo Doctors',
    description: 'Manage appointments, patients & grow your clinic with Clinexy. Reduce no-shows, save time & own your patients.',
    keywords: 'digital clinic software, appointment system for doctors, clinic management software, solo doctor software'
  },
  '/blogs': {
    title: 'Clinexy Blogs',
    description: 'Read practical guides, growth tips, and clinic management insights for solo doctors.',
    keywords: 'doctor blogs, clinic growth tips, practice management guides, clinexy blog'
  },
  '/blogs/:slug': {
    title: 'Clinexy Blog Details',
    description: 'Detailed blog article from Clinexy on clinic operations, patient management, and growth.',
    keywords: 'clinic management article, doctor guide, patient care content, clinexy blog'
  },
  '/admin': {
    title: 'Clinexy Admin Login',
    description: 'Secure admin login for Clinexy blog management.',
    keywords: 'clinexy admin login, blog admin, secure login'
  },
  '/create-blog': {
    title: 'Create Blog | Clinexy Admin',
    description: 'Create and publish Clinexy blog content from the admin dashboard.',
    keywords: 'create blog, clinexy admin, blog dashboard'
  },
  '/admin/blogs': {
    title: 'Manage Blogs | Clinexy Admin',
    description: 'Manage, edit, and publish blog posts in Clinexy admin panel.',
    keywords: 'manage blogs, clinexy admin panel, blog management'
  },
  '/solutions/solo-doctors': {
    title: 'Software for Solo Doctors to Manage & Grow Clinics',
    description: 'All-in-one digital clinic platform for independent doctors. Appointments, branding, reminders & growth.',
    keywords: 'software for solo doctors, clinic management for doctors, practice management'
  },
  '/features/doctor-branding-growth': {
    title: 'Doctor Personal Branding & Clinic Growth Software',
    description: 'Build your personal doctor brand, website, reviews & patient growth automatically.',
    keywords: 'doctor personal website, doctor marketing software, clinic growth'
  },
  '/features/appointments-reminders': {
    title: 'Appointment Booking & Reminders for Doctors',
    description: 'Online booking, WhatsApp reminders & no-show reduction for solo doctors.',
    keywords: 'appointment booking for doctors, patient reminders, no-show reduction'
  },
  '/features/teleconsultation-prescriptions': {
    title: 'Teleconsultation & Digital Prescriptions for Doctors',
    description: 'Consult online, issue digital prescriptions & manage patient records easily.',
    keywords: 'teleconsultation software, digital prescriptions, telehealth'
  },
  '/features/patient-management': {
    title: 'Patient Management System for Solo Doctors',
    description: 'Manage patients, records, reports & appointment history securely.',
    keywords: 'patient management system, electronic medical records, EMR'
  },
  '/features/doctor-website': {
    title: 'Personal Website for Doctors',
    description: 'Your own doctor website with bookings, patient login & trust signals.',
    keywords: 'doctor personal website, clinic website builder, SEO for doctors'
  },
  '/features/reviews-reputation': {
    title: 'Doctor Reviews & Reputation Management',
    description: 'Get more 5-star reviews & build patient trust automatically.',
    keywords: 'doctor reviews software, clinic reputation management, google reviews'
  },
  '/pricing/solo-doctors': {
    title: 'Pricing for Solo Doctors',
    description: 'Simple, affordable pricing for independent doctors. No commissions. No lock-in.',
    keywords: 'doctor software pricing, clinic software cost'
  },
  '/compare/clinexy-vs-mocdoc': {
    title: 'Clinexy vs MocDoc',
    description: 'Clinic software comparison for solo doctors.',
    keywords: 'mocdoc alternative, clinexy vs mocdoc'
  },
  '/compare/clinexy-vs-practo': {
    title: 'Clinexy vs Practo for Doctors',
    description: 'Why solo doctors switch from Practo to Clinexy.',
    keywords: 'practo alternative, clinexy vs practo'
  },
  '/compare/clinexy-vs-simplepractice': {
    title: 'Clinexy vs SimplePractice',
    description: 'A simpler, growth-focused alternative to SimplePractice.',
    keywords: 'simplepractice alternative, clinexy vs simplepractice'
  },
  '/compare/clinexy-vs-cliniko': {
    title: 'Clinexy vs Cliniko',
    description: 'Why Clinexy is better for growth-focused solo doctors.',
    keywords: 'cliniko alternative, clinexy vs cliniko'
  }
};

const DEFAULT_ROUTE_META: RouteMetaInfo = {
  title: 'Clinexy | Clinic Software for Solo Doctors',
  description: 'Clinexy helps solo doctors manage appointments, patients, and clinic growth with one simple platform.',
  keywords: 'clinexy, clinic software, doctor software, appointment management'
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const ProtectedAdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isLoggedIn = localStorage.getItem(ADMIN_AUTH_KEY) === "true";
  if (!isLoggedIn) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

const RouteMeta = () => {
  const { pathname } = useLocation();

  const isBlogDetailsPage = pathname.startsWith('/blogs/');
  const sitemapPage = SITEMAP.find((page) => page.path === pathname);

  const meta: RouteMetaInfo = isBlogDetailsPage
    ? ROUTE_META['/blogs/:slug']
    : ROUTE_META[pathname] ||
      (sitemapPage
        ? {
            title: sitemapPage.title,
            description: sitemapPage.metaDescription,
            keywords: sitemapPage.keywords.join(', ')
          }
        : DEFAULT_ROUTE_META);

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords} />
    </Helmet>
  );
};

const App: React.FC = () => {
  const hideLayout =
    location.pathname === "/calculator-iframe" ||
    location.pathname === "/value-cost-calculator" ||
    location.pathname === "/cliniko-calculator" ||
    location.pathname === "/mocdoc-calculator" ||
    location.pathname === "/calculator-only";

  return (
    <Router>
      <ScrollToTop />
      <ScrollToHash />
      <RouteMeta />
      <div className="font-sans text-slate-900 bg-white">
        {!hideLayout && <Header />}
        <main>
          <Routes>
            {/* Explicit Home Route */}
            <Route path="/" element={<Home />} />
            <Route path="/calculator-iframe" element ={<CalculatorPage />} />
            <Route path="/calculator-only" element={<PractoVsClinexyCalculator />} />
            <Route path="/value-cost-calculator" element={<ValueCostCalculator />} />
            <Route path="/cliniko-calculator" element={<ClinikoCalculator />} />
            <Route path="/mocdoc-calculator" element={<MocDocCalculator />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:slug" element={<BlogDetails />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/create-blog"
              element={
                <ProtectedAdminRoute>
                  <AdminBlogs />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/blogs"
              element={
                <ProtectedAdminRoute>
                  <AdminBlogs />
                </ProtectedAdminRoute>
              }
            />
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
         {!hideLayout && <Footer />}
      </div>
    </Router>
  );
};

export default App;
