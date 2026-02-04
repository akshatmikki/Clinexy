import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Twitter, Linkedin, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Clinexy</span>
            </Link>
            <p className="text-sm text-slate-400 mb-6">
              Digital clinic software for solo doctors to manage appointments, build trust, and grow without marketing.
            </p>
            <div className="flex gap-4">
              <button className="text-slate-400 hover:text-white transition-colors cursor-pointer"><Twitter className="h-5 w-5" /></button>
              <button className="text-slate-400 hover:text-white transition-colors cursor-pointer"><Linkedin className="h-5 w-5" /></button>
              <button className="text-slate-400 hover:text-white transition-colors cursor-pointer"><Facebook className="h-5 w-5" /></button>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/features/appointments-reminders" className="hover:text-primary-400 transition-colors">Appointments</Link></li>
              <li><Link to="/features/teleconsultation-prescriptions" className="hover:text-primary-400 transition-colors">Teleconsultation</Link></li>
              <li><Link to="/features/patient-management" className="hover:text-primary-400 transition-colors">Patient Records</Link></li>
              <li><Link to="/features/doctor-branding-growth" className="hover:text-primary-400 transition-colors">Doctor Branding</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Comparison</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/compare/clinexy-vs-practo" className="hover:text-primary-400 transition-colors">Vs Practo</Link></li>
              <li><Link to="/compare/clinexy-vs-simplepractice" className="hover:text-primary-400 transition-colors">Vs SimplePractice</Link></li>
              <li><Link to="/compare/clinexy-vs-cliniko" className="hover:text-primary-400 transition-colors">Vs Cliniko</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal & Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/security" className="hover:text-primary-400 transition-colors">Security</Link></li>
              <li><Link to="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/demo" className="hover:text-primary-400 transition-colors">Book a Demo</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/#blogs"
                  className="hover:text-primary-400 transition-colors"
                >
                  Blogs
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Clinexy. All rights reserved.
        </div>
      </div>
    </footer>
  );
};